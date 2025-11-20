import { createClient } from '@/lib/supabase/server'

async function testDatabaseConnection() {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        status: 'error',
        message: 'Environment variables not configured',
        details: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
      }
    }

    const supabase = await createClient()

    // Try to query the locations table (should be empty but accessible)
    const { data, error } = await supabase
      .from('locations')
      .select('count')
      .limit(1)

    if (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        details: error.message
      }
    }

    return {
      status: 'success',
      message: 'Successfully connected to Supabase!',
      details: 'Database is ready to use'
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default async function Home() {
  const connectionTest = await testDatabaseConnection()

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">QRganize</h1>
        <p className="text-lg text-gray-600">
          Smart location & item tracking with QR codes
        </p>

        {/* Connection Status */}
        <div className={`mt-8 p-6 rounded-lg ${
          connectionTest.status === 'success'
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {connectionTest.status === 'success' ? '✅' : '❌'}
            </span>
            <h2 className="text-2xl font-semibold">
              {connectionTest.message}
            </h2>
          </div>
          <p className={connectionTest.status === 'success' ? 'text-green-700' : 'text-red-700'}>
            {connectionTest.details}
          </p>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Next Steps</h2>
          {connectionTest.status === 'success' ? (
            <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
              <li>✅ Supabase database connected</li>
              <li>Build authentication pages (login/signup)</li>
              <li>Create location management features</li>
              <li>Create item management features</li>
              <li>Add QR code generation and scanning</li>
            </ul>
          ) : (
            <div className="mt-4 space-y-2 text-gray-700">
              <p className="font-semibold">To fix the connection:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Create a Supabase project at <a href="https://supabase.com" className="text-blue-600 underline" target="_blank">supabase.com</a></li>
                <li>Run the SQL schema from <code className="bg-gray-200 px-1 rounded">supabase/schema.sql</code></li>
                <li>Copy <code className="bg-gray-200 px-1 rounded">.env.local.example</code> to <code className="bg-gray-200 px-1 rounded">.env.local</code></li>
                <li>Add your Supabase URL and anon key to <code className="bg-gray-200 px-1 rounded">.env.local</code></li>
                <li>Restart the dev server</li>
              </ol>
              <p className="mt-4">See <code className="bg-gray-200 px-1 rounded">SETUP.md</code> for detailed instructions.</p>
            </div>
          )}
        </div>

        {/* Environment Info */}
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-600">
          <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
          <br />
          <strong>Supabase URL configured:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}
          <br />
          <strong>Supabase Key configured:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}
        </div>
      </main>
    </div>
  );
}
