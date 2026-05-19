

interface PlaceholderAdminPageProps {
  title: string;
}

const PlaceholderAdminPage: React.FC<PlaceholderAdminPageProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-charcoal mb-6">{title}</h1>
      <div className="bg-warm-white rounded-2xl shadow-soft border border-border-soft p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-light text-sage mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <h2 className="text-xl font-bold text-charcoal mb-2">Geliştirme Aşamasında</h2>
        <p className="text-charcoal/70 max-w-md mx-auto">Bu modül ilerleyen fazlarda backend entegrasyonu ile birlikte tamamlanacaktır.</p>
      </div>
    </div>
  );
};

export default PlaceholderAdminPage;
