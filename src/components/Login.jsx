import GoogleLoginButton from "./buttons/GoogleLoginButton";
export default function Login() {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 h-full bg-stone-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account to proceed
          </h2>
        </div>

        <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <GoogleLoginButton />
        </div>
      </div>
    </>
  );
}
