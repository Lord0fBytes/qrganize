export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">QRganize</h1>
        <p className="text-lg text-gray-600">
          Smart location & item tracking with QR codes
        </p>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
          <p className="text-gray-700">
            Your QRganize app is successfully set up. Next steps:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li>Set up Supabase database</li>
            <li>Configure authentication</li>
            <li>Build location and item management</li>
            <li>Add QR code scanning</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
