import TextStreamCanvas from "./components/TextStreamCanvas";

export default function HomePage() {
  return (
    <div className="page-container">
      {/* The performant canvas animation replaces the old div container */}
      <TextStreamCanvas />
      
      <div className="page-wrapper">
        <header>
          <div className="logo">Invaro</div>
          <nav>
            <a href="#">Docs</a>
            <a href="#">Login</a>
            <a href="#" className="button-outline">Get Started</a>
          </nav>
        </header>
        <main>
          <h1>Extract Smarter</h1>
          <p className="subtitle">AI-powered document processing for financial workflows. Upload. Process. Done.</p>
          <div className="cta-buttons">
            <a href="#" className="button-primary">Start Processing</a>
            <a href="#" className="button-secondary">Explore API</a>
          </div>
        </main>
      </div>
    </div>
  );
}
