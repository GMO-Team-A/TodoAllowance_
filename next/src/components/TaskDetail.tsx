
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

type TaskDetailProps = {
  task:{
   id: number;
   title: string;
   content: string;
   dueDate: string;
  };
};

const TaskDetail: React.FC<TaskDetailProps> = ({ task })  => {

  return (
      <>
        <Head>
          <title>"{task.title}</title>
          <meta name="description" content={`Todoの詳細: ${task.content}`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${styles.main} ${inter.className}`}>
          <h2>{task.title}</h2>
          <p>{task.content}</p>
          <p>期日: {new Date(task.dueDate).toLocaleDateString()}</p>
          <br />
          
        
        <Link href="/">         
          <p>Todo Listへ</p>
          </Link>
        </main>
      </>
    );
  };
  
 
  
  export default TaskDetail;