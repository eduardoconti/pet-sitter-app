import LoginForm from '@/components/sign-in';
import Head from 'next/head';
export default function SignIn() {

  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <LoginForm />
    </>
  );
}
