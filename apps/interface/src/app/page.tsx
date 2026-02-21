import { Button } from "@repo/ui";

const Home = () => {
  return (
    <div className='text-blue-400'>
      <h1 className='text-4xl font-bold'>Welcome to the Interface App!</h1>
      <p className='mt-4 text-lg'>This is a sample page using the shared UI components.</p>
      <Button className='mt-6'>Click Me</Button>
    </div>
  )
}

export default Home;