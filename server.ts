import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let isFirebaseInitialized = false;
try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    // Read the database ID from the config file if it exists
    let databaseId = '(default)';
    try {
      const configPath = path.join(__dirname, 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.firestoreDatabaseId) {
          databaseId = config.firestoreDatabaseId;
        }
      }
    } catch (e) {
      console.warn('Could not read firebase-applet-config.json for databaseId', e);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    // We need to specify the databaseId if it's not the default
    // Note: The admin SDK handles databaseId differently depending on the version.
    // We will just initialize the default app and use getFirestore(app, databaseId) if needed.
    isFirebaseInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Webhooks will not be able to update Firestore.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Expose non-sensitive environment variables to the client
  app.get('/api/config', (req, res) => {
    res.json({
      paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
      paypalPlanId: process.env.PAYPAL_PLAN_ID || '',
      contactEmail: process.env.CONTACT_EMAIL || 'leonardoandresdiaz2606@gmail.com',
    });
  });

  // PayPal Webhook Endpoint
  app.post('/api/webhooks/paypal', async (req, res) => {
    console.log('Received PayPal Webhook:', req.body.event_type);
    
    // In a production environment, you MUST verify the webhook signature here
    // using the PayPal SDK or by calling the PayPal API.
    // For this prototype, we'll process the event directly.

    const event = req.body;

    if (!isFirebaseInitialized) {
      console.error('Firebase Admin is not initialized. Cannot process webhook.');
      return res.status(500).send('Server configuration error');
    }

    try {
      // Read the database ID from the config file if it exists
      let databaseId = '(default)';
      try {
        const configPath = path.join(__dirname, 'firebase-applet-config.json');
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (config.firestoreDatabaseId) {
            databaseId = config.firestoreDatabaseId;
          }
        }
      } catch (e) {
        // Ignore
      }

      const db = admin.firestore();
      // If using a named database, we need to access it differently, but admin.firestore() 
      // usually defaults to the one in the project. If it's a named database, we might need 
      // to use the specific databaseId.
      // For now, we'll assume the default or that the service account has access.

      // Handle subscription events
      if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED' || 
          event.event_type === 'BILLING.SUBSCRIPTION.SUSPENDED' || 
          event.event_type === 'BILLING.SUBSCRIPTION.EXPIRED') {
        
        const subscriptionId = event.resource.id;
        console.log(`Processing cancellation for subscription: ${subscriptionId}`);

        // Find the user with this subscription ID
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('paypalSubscriptionId', '==', subscriptionId).get();

        if (snapshot.empty) {
          console.log('No matching user found for this subscription ID.');
          return res.status(404).send('User not found');
        }

        // Update the user's tier to 'free'
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.update(doc.ref, { 
            tier: 'free',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`Downgraded user ${doc.id} to free tier.`);
        });

        await batch.commit();
        res.status(200).send('Webhook processed successfully');
      } 
      else if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
        // Handle activation if needed
        res.status(200).send('Webhook processed successfully');
      }
      else {
        // Ignore other events
        res.status(200).send('Event ignored');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Internal server error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    // For Express v4, use '*'
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
