import { db } from '../util/admin';
import { Request, Response } from 'express';

const getQueues = (_: Request, res: Response) => {
   db.collection('queue')
      .get()
      .then((data) => {
         let queue: Array<object> = [];
         data.forEach((doc) => {
            queue.push({
               queueId: doc.id,
               userName: doc.data().userName,
               position: doc.data().password,
               createdAt: doc.data().createdAt,
            });
         });
         return res.json(queue);
      })
      .catch((err) => console.error(err));
};

const enterQueue = async (req: Request, res: Response) => {
   // find last position
   let lastPosition: number = 0;
   await db
      .collection('queue')
      .orderBy('position', 'desc')
      .limit(1)
      .get()
      .then((data) => {
         lastPosition = data.docs[0].data().position;
      })
      .catch(() => {
         console.log('First customer queued.');
      });
   lastPosition++;

   // create user object
   const newUser: object = {
      position: lastPosition,
      userEmail: req.body.userEmail,
      createdAt: new Date().toISOString(),
   };

   // TODO: check if user is already in queue.

   // put user object in queue
   db.collection('queue')
      .add(newUser)
      .then((doc) => {
         res.json({ message: `document ${doc.id} created successfully` });
      })
      .catch((err) => {
         res.status(500).json({ error: 'something went wrong' });
         console.error(err);
      });
};

export { getQueues, enterQueue };
