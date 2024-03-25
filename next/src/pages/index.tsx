
import { Inter } from 'next/font/google';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChakraProvider, Input, Button, Flex, Box,Heading,Text } from "@chakra-ui/react";

const inter = Inter({ subsets: ['latin'] });

type Task = {
  id: number;
  title: string;
  content: string;
  dueDate: string;
  completed: boolean;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [balanceData, setBalanceData] = useState<any>(null);
  const [createTask, setCreateTask] = useState({
    title: '',
    content: '',
    dueDate: '',
  });

  useEffect(() => {
    // マウント時に銀行API からデータを取得
    const fetchBankData = async () => {
      try {
        const response = await fetch('/api/sunabar/amount'); 
        if (!response.ok) {
          throw new Error('Failed to fetch balance data');
        }
        const data = await response.json();
        setBalanceData(data);
      } catch (error) {
        console.error('Error fetching balance data:', error);
      }
    };

    fetchBankData(); // マウント時にデータを取得する
    return () => {
      
    };
  }, ); 

//完了・未完了タスク
  useEffect(() => {
    fetchTasks();
  }, []);
 const fetchTasks = async () => {
    try {
      const AllData = await fetch('/api/tasks');
      const data = await AllData.json();
      console.log(data);
      //data.tasksから未完了と完了済のタスクをフィルタリングして条件に合致する要素で新しい配列を作る
      setTasks(data.taskData.tasks.filter((task:any) => !task.completed));//task.completedがtrueであるものを取り除く
      setCompletedTasks(data.taskData.tasks.filter((task:any) => task.completed));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

//タスクの編集
  const handleEdit = (taskId: number) => {
    
  // 編集対象のタスクの特定
  const taskToEdit = tasks.find(task => task.id === taskId);
  if (taskToEdit) {
  // 見つかったタスクの編集フォームを表示する
    setEditTask(taskToEdit);//editTask状態にセット
    }
  };
  // 編集フォームの入力値を更新する処理
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;//e.targetはイベントが発生した要素
    setEditTask(prevTask => {
      if (!prevTask) return null; // prevTask が null の場合は null を返す
      return {
      ...prevTask,//既存のeditTaskのプロパティを展開
      [name]: value,//新しい値をセット
      };
    });
  };

  // 編集フォームを閉じる処理（キャンセル）
  const handleEditCancel = () => {
    setEditTask(null);//editTask状態をクリアして閉じる
  };

  // 編集を保存する処理（サーバーに送信）
  const handleEditSave = async () => {
  try {
    if (!editTask) return; // editTask が null の場合は処理しない
    const response = await fetch(`http://localhost:3001/api/tasks/${editTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(editTask),
    });

    if (!response.ok) {
      throw new Error('Failed to save edited task');
    }

  // 編集が成功したらタスク一覧を再取得して更新
    fetchTasks();

  // 編集フォームを閉じる
    setEditTask(null);

        console.log('Task edited successfully');
          } catch (error) {
        console.error('Error editing task:', error);
        }  
  };

//タスクの削除
  const handleDelete = async (taskId: number) => {
    // const confirmDelete = window.confirm('本当に削除しますか？');
    //      console.log(`Delete task with ID ${taskId}`);
    //   if (confirmDelete) {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: 'DELETE',
        mode: 'cors',
      });
  
      if (!response.ok) {
          throw new Error('Failed to delete task');
      }
  
  // タスク削除が成功したら再取得して更新
    fetchTasks();
      console.log('Task deleted successfully');
      } catch (error) {
      console.error('Error deleting task:', error);
      }
  };

//タスクの完了  
const handleComplete = async (taskId: number) => {
  try {
    const response = await fetch('http://localhost:3001/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ taskId }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete task');
    }

    const bankApiResponse = await fetch(`/api/tasks/${taskId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ "taskId":taskId }),
     });
     console.log("taskId:",taskId);

    if (!bankApiResponse.ok) {
      throw new Error('Failed to transfer funds');
    }

// タスク完了が成功したら再取得して更新
  fetchTasks();
        console.log('Task marked as completed successfully');
      } catch (error) {
        console.error('Error completing task:', error);
      }
};
//タスクを未完了にもどす
const handleUncompleted = async (taskId: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/uncomplete/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error('Failed to uncomplete task');
    }

    fetchTasks(); // タスク一覧を更新
    console.log('Task marked as uncompleted successfully');
  } catch (error: any) { // TypeScript 4.0以降では `unknown` とすることが推奨されます
    console.error('Error uncompleting task:', error.message);
  }
};




//タスクの追加（入力フィールドに変更があったときに呼び出される  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  //フォームが送信したときに呼び出される
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();//デフォルトのフォーム送信を防ぐ
    //console.log('New task submitted:', createTask);

    try {
      const response = await fetch('http://localhost:3001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(createTask),
      });

      if (!response.ok) {
        throw new Error('Failed to add new task');
      }

  // 新しいタスクが正常に作成された場合、タスク一覧を再取得して更新
      fetchTasks();

  // 入力フォームをリセット
      setCreateTask({
        title: '',
        content: '',
        dueDate: '',
      });

      console.log('New task added successfully');
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  
  


  return ( 
    <>
      
      <ChakraProvider> 
      <main className={`${styles.main} ${inter.className}`}>
      <Heading fontSize="2xl">PocketMoneyMission</Heading>
       <br></br>
      
       <Text fontSize="xl">Let's do it！</Text>
        <br></br>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div>
                <Flex align ="center" justify="space-between">
                <Link href={`/tasks/${task.id}`}>
                  <p>{task.title}  ({task.content}円)</p>
                </Link>
                <Flex >
                <Button m={1} bg={"#dcdcdc"} onClick={() => handleComplete(task.id)}>完了</Button>
                <Button m={1} bg={"#f5f5f5"} onClick={() => handleEdit(task.id)}>編集</Button>
                <Button m={1} bg={"#808080"} onClick={() => handleDelete(task.id)}>削除</Button>
                </Flex>
                </Flex>
 </div>
             </li>
           ))}
          </ul>
          {/* 編集フォームの表示条件付きレンダリング */}
{editTask && (
          <div>
            <h3>編集</h3>
            <label>
              内容:
              <Input bg={"cfd4e6"}
                type="text"
                name="title"
                value={editTask.title}
                onChange={handleEditInputChange}
                width ="300px"
              />
              
            </label>
            <label>
              金額:
              <Input bg={"cfd4e6"}
                type="text"
                name="content"
                value={editTask.content}
                onChange={handleEditInputChange}
                width ="100px"
              />
            </label>
            <Button m={1} bg={"#f5f5f5"} onClick={handleEditSave}>保存</Button>
            <Button m={1} bg={"#f5f5f5"} onClick={handleEditCancel}>戻る</Button>
          </div>
        )}
        <br></br>
        <Text fontSize="xl">Completed！</Text>
        <br></br>  
        <ul>
          {completedTasks.map((task) => (
            <li key={task.id}>
              <div>
              <Flex align ="center" justify="space-between">
                <Link href={`/api/tasks/${task.id}`}>
                  <p><Box mr={25}>{task.title}</Box></p>
                </Link>
                
                <span><Box mr={2}>送金済!</Box></span>
                <Button m={1} bg={"#808080"} onClick={() => handleDelete(task.id)}>削除</Button>
                <Button m={1} bg={"#808080"} onClick={() => handleUncompleted(task.id)}>戻る</Button>
              </Flex>
              </div>
            </li>
          ))}
        </ul>
        <Box>
      <h3>銀行残高</h3>
      {balanceData ? (
        <div>
          <Flex align ="center" justify="space-between">
          <p><Box mr={10}>親口座残高: {Number(balanceData.balance.spAccountBalances[0].odBalance).toLocaleString()}円</Box></p>
          <p>お小遣い残高: {Number(balanceData.balance.spAccountBalances[2].odBalance).toLocaleString()}円</p>
          </Flex>
        </div>
      ) : (
        <p>Loading balance data...</p>
      )}
    </Box>

<br></br>
        <form onSubmit={handleSubmit}>
        <Text fontSize="xl">Mission追加</Text>
           <label>
             内容:
             <Input bg={"cfd4e6"}
               type="text"
               name="title"
               value={createTask.title}
               onChange={handleInputChange}
               width ="300px"
             />
           </label>
           <label>
             金額:
             <Input 
               bg={"cfd4e6"}
               type="text"
               name="content"
               value={createTask.content}
               onChange={handleInputChange}
               width ="100px"
             />
           </label>
           <br></br>
           <label>
            
              <DatePicker 
               selected={createTask.dueDate ? new Date(createTask.dueDate) : null}
               onChange={(date) =>
                 setCreateTask((prevTask) => ({
                   ...prevTask,
                   dueDate: date ? date.toISOString() : '', // 選択した日付をISOStringに変換して格納
                }))
               }
              />
           </label>
           
           <Button m={1} bg={"#f5f5f5"} type="submit">追加</Button>
         </form>
       
            
          
         
       </main>
       </ChakraProvider> 
       </>
   );
 };
 
 export default Home;






