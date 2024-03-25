import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 銀行APIとの通信
    const balanceResponse = await axios.get('https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances', {
      headers: {
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': '--------'
      }
    });

    //console.log(balanceResponse.data);
   // データをクライアントに返す
   res.status(200).json({ balance: balanceResponse.data });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
}
}