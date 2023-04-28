import React from 'react';

const AuthError = () => {
  return (
    <div className="overflow-hidden bg-slate-900 py-24 sm:py-32 min-h-screen">
      <div className="relative isolate px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#01ffff] to-[#ea07ff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Authentication Error</h1>
                <p className="mt-6 text-lg leading-8 text-white">
                  There was an error while trying to authenticate with Twitch. Please try again later.
                </p>
                <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-white lg:max-w-none">
                    <div className="mt-10 m-auto text-left">
                      <a
                        href="/auth"
                        className="rounded-md cursor-pointer bg-red-600 px-7 py-3 text-md font-semibold text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Auth Page
                      </a>
                      <a
                        href="/"
                        className="ml-10 rounded-md cursor-pointer bg-blue-600 px-7 py-3 text-md font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Home Page
                      </a>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
