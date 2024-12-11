import TopNav from "@/components/TopNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
          <p className="text-xl text-gray-600 mb-6">You are now logged in!</p>
        </div>
      </main>
    </div>
  );
};

export default Index;