// import { useRouter } from "next/router";
// import TaskDetail from "../../components/TaskDetail";  
// import { GetServerSideProps } from "next";

// type TaskDetailProps = {
//   task:{
//    id: number;
//    title: string;
//    content: string;
//    duedate: string;
//   };
// };


// const TaskPage = ({ task }:TaskDetailProps) => {
//   return <TaskDetail task={task} />;
// };

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   try {
//   const { id } = params ??{};
//   const req = await fetch(`http://localhost:3001/api/tasks/${id}`);
//   const data = await req.json();


//   return {
//     props: {
//       task: data,
//     },
//   };
// } catch (error) {
//     console.error("Error fetching data:", error);
//     return {
//       props: {
//         task: null,
//       },
//     };
//  }
// };

// export default TaskPage;