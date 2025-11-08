import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">AI-Powered</span>
            <span className="block text-blue-600 mt-2">Job Application System</span>
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
            Find and apply to your dream jobs with the power of AI. Streamline your job search and application process.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/auth"
              className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/jobs"
              className="rounded-md bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-50"
            >
              Browse Jobs
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Smart Job Matching</h3>
            <p className="mt-2 text-gray-500">
              Our AI matches you with the most relevant job opportunities based on your skills and preferences.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Automated Applications</h3>
            <p className="mt-2 text-gray-500">
              Apply to multiple positions with one click, tailored to each job description.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Application Tracking</h3>
            <p className="mt-2 text-gray-500">
              Keep track of all your applications and get status updates in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
