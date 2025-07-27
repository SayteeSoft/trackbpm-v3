
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: July 27, 2025</p>
          
          <Separator className="my-6" />

          <div className="space-y-6 text-foreground">
            <p>
              Welcome to TRACK ⚡ BPM. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>Usage Data:</strong> We may automatically collect information your browser sends whenever you visit our Site. This may include your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
              </li>
              <li>
                <strong>Search Queries:</strong> We collect the search queries you submit to our service to provide and improve our song data services. These queries are processed by our backend and third-party services like Spotify to retrieve song information.
              </li>
              <li>
                <strong>Chatbot Interactions:</strong> We collect the messages you send to our chatbot to provide responses and improve our AI models.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold pt-4">How We Use Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Provide, operate, and maintain our website.</li>
              <li>Improve, personalize, and expand our website.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Communicate with you for customer service, to provide you with updates and other information relating to the website.</li>
            </ul>

            <h2 className="text-2xl font-semibold pt-4">Data Sharing</h2>
            <p>
              We do not sell, distribute, or lease your personal information to third parties unless we have your permission or are required by law to do so. We may share anonymized, aggregated data with third parties for research and analysis purposes.
            </p>
             <p>
              Our service relies on third-party APIs, such as Spotify, to provide song data. Your search queries (e.g., artist and song title) are sent to these services to fulfill your request. We recommend you review their privacy policies.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, to have any inaccuracies corrected, and to request the deletion of your personal data.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
