import { Icon } from '../components/ui/Icon'

export function OnboardingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-background-darker)] text-slate-900 dark:text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 min-h-0 overflow-auto">
        <div className="w-full max-w-[640px] flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex gap-6 justify-between items-end">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Step 3 of 4: Notification Setup</p>
              <p className="text-[var(--color-primary)] text-sm font-bold">75% Complete</p>
            </div>
            <div className="rounded-full bg-[#3b3b54] h-2 overflow-hidden">
              <div className="h-full rounded-full bg-[var(--color-primary)] w-3/4" />
            </div>
          </div>

          <div className="bg-[#1c1c27] rounded-xl shadow-xl border border-[#2b2b3d] overflow-hidden">
            <div className="p-8 border-b border-[#2b2b3d] text-center">
              <h1 className="text-2xl font-bold mb-2">Configure Alerts</h1>
              <p className="text-slate-400 text-sm">Choose how you want to be notified about transaction updates, security alerts, and system health.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="mail" className="text-[var(--color-primary)]" size={24} />
                    <label htmlFor="email-toggle" className="font-semibold">Email Notifications</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input id="email-toggle" type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                <input type="email" placeholder="billing@company.com" className="w-full bg-[#111118] border border-[#3b3b54] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="sms" className="text-[var(--color-primary)]" size={24} />
                    <label htmlFor="sms-toggle" className="font-semibold">SMS Security Alerts</label>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input id="sms-toggle" type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
                <div className="flex gap-2">
                  <select className="w-24 bg-[#111118] border border-[#3b3b54] rounded-lg px-2 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none">
                    <option>+1</option>
                    <option>+44</option>
                    <option>+49</option>
                    <option>+33</option>
                  </select>
                  <input type="tel" placeholder="555-0123" className="flex-1 bg-[#111118] border border-[#3b3b54] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="webhook" className="text-[var(--color-primary)]" size={24} />
                    <span className="font-semibold">Developer Webhook (Optional)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <input type="url" placeholder="https://api.yourdomain.com/webhooks/payflow" className="w-full bg-[#111118] border border-[#3b3b54] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none" />
                  <p className="text-xs text-slate-500 px-1">Trigger automated workflows in your own system on payment success.</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-[#161622] flex flex-col gap-4">
              <button type="button" className="w-full bg-[var(--color-primary)] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                Confirm Setup
                <Icon name="arrow_forward" size={24} />
              </button>
              <button type="button" className="w-full text-center text-sm font-medium text-slate-500 hover:text-[var(--color-primary)] transition-colors">Save & continue later</button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Icon name="lock" size={18} />
              All notification data is encrypted and secure.
            </div>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent pointer-events-none" />
    </div>
  )
}
