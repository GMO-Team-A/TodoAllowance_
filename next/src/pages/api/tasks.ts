import  { NextApiRequest, NextApiResponse } from 'next'
 


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await fetch('http://localhost:3001/')
    .then(res => res.json())
    .then(data =>{
      res.status(200).json(data);
    })
    .catch (err =>{
      res.status(500).json({ error: 'Internal Server Error' });
    }); 
       
  }
