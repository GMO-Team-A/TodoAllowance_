import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

     // 2. 選択した task の id
     const selectedTaskId = req.body.taskId;// リクエストから task の id を取得する
     console.log("selectedTaskId:",selectedTaskId);

     // 3. DBから taskData 取得
     const otherApiResponse = await fetch(`http://localhost:3001/api/tasks/${selectedTaskId}`);
     const tasksData = await otherApiResponse.json();
     console.log("tasksData:",tasksData);
 
     // 4.taskData から金額を取得
     const paymentAmountFromDB = tasksData.content// 見つかった場合は content を取得
     console.log("paymentAmountFromDB:", paymentAmountFromDB);

    const transferResponse = await axios.post('https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer', {
      depositSpAccountId: 'SP50220573245',
      debitSpAccountId: 'SP30110007856',
      currencyCode: 'JPY',
      paymentAmount: paymentAmountFromDB // DBから取得した金額を使用
  
    }, {
      headers: {
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': 'ZDViOGI3ZTkzNmJjZTljM2RmNzJjNDk4'
      }
    });

    console.log(transferResponse.data);
    res.status(200).json({ transfer: transferResponse.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
  