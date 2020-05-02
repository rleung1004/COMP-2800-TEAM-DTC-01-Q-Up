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

const enterQueue = (req: Request, res: Response) => {
   const newUser = {
      position: req.body.position,
      userEmail: req.body.userEmail,
      accountType: req.body.accountType,
      createdAt: new Date().toISOString(),
   };

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
