export function BlogPostContent({ onSwitch }: { onSwitch?: () => void }) {
  return (
    <>
      <div className="bg-[#DEEBFF] border-l-4 border-[#0052CC] p-4 rounded-r-md mb-6">
        <h4 className="text-[#0747A6] font-semibold mb-1 text-sm uppercase tracking-wider">Status</h4>
        <p className="text-sm text-[#172B4D]">Approved — October 2021</p>
      </div>

      <h3>Context</h3>
      <p>
        As we integrate with more third-party payment providers (currently Stripe, soon PayPal), we are seeing HTTP client details leaking into our domain logic. Developers are catching <code>GuzzleHttp\Exception\TransferException</code> inside the checkout service, which makes it hard to test and tightly couples our core domain to our current HTTP client.
      </p>

      <h3>Decision</h3>
      <p>
        We have decided that all external API communication must stay completely behind adapter boundaries.
      </p>
      <ul>
        <li>Interfaces for external services should be defined in our domain or application layer.</li>
        <li>Concrete implementations (adapters) should handle all HTTP communication.</li>
        <li><strong>No HTTP exceptions should ever cross the adapter boundary.</strong> They must be caught and translated into domain-specific exceptions.</li>
      </ul>

      <h3>Implementation Guidelines</h3>
      <p>
        When working on the <code>PaymentGateway</code> or similar integrations, please adhere to the following rules:
      </p>
      <pre className="bg-[#F4F5F7] p-4 rounded-md font-mono text-sm overflow-x-auto text-[#172B4D] border border-[#DFE1E6]">
        <code>
// Example: DO NOT DO THIS
public function charge(int $amount) {'{'}
    try {'{'}
        $this-&gt;httpClient-&gt;post('https://api.stripe.com/charges', ...);
    {'}'} catch (ConnectException $e) {'{'}
        // Leaking HTTP details!
        throw $e; 
    {'}'}
{'}'}
        </code>
      </pre>
      
      <p>
        Instead, keep the interface clean and let the adapter do the dirty work. Please remember to check this page before doing any payment-related changes.
      </p>

      <div className="my-8 h-px bg-[#DFE1E6]"></div>

      <h3>Consequences</h3>
      <p>
        By isolating external APIs, we can swap out our HTTP client (e.g., from Guzzle to Symfony HttpClient) without touching the domain. It also makes our tests significantly faster since we can mock the adapter interface.
      </p>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-lg border border-[#DFE1E6] bg-[#FAFBFC] p-5 shadow-sm md:flex-row md:items-center">
        <div className="text-sm text-[#172B4D]">
          <span className="font-semibold block mb-1">Tired of reading stale documentation?</span> 
          See how this architecture rule looks when it is directly attached to the codebase.
        </div>
        <button 
          onClick={onSwitch} 
          className="w-full rounded bg-[#0052CC] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0047B3] focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2 border-none sm:w-auto whitespace-nowrap"
        >
          View Living Architecture
        </button>
      </div>
    </>
  );
}
