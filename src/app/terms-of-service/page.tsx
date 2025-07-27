
import { Separator } from '@/components/ui/separator';

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: July 27, 2025</p>
          
          <Separator className="my-6" />

          <div className="space-y-6 text-foreground">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the TRACK ⚡ BPM website (the "Service") operated by us.
            </p>
            
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Accounts</h2>
            <p>
              When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of TRACK ⚡ BPM and its licensors.
            </p>
            
            <h2 className="text-2xl font-semibold pt-4">Links To Other Web Sites</h2>
            <p>
                Our Service may contain links to third-party web sites or services that are not owned or controlled by TRACK ⚡ BPM. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Termination</h2>
            <p>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the land, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-semibold pt-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
