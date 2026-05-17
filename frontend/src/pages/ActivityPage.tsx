import { Receipt, Wallet, Users, Info } from 'lucide-react';

export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      type: 'expense',
      icon: Receipt,
      title: 'You added "Dinner at Taj" in Goa Trip 2026',
      amount: '₹150',
      amountType: 'lent',
      time: '2 hours ago',
      isNew: true
    },
    {
      id: 2,
      type: 'settle',
      icon: Wallet,
      title: 'Sarah M. paid you',
      amount: '₹45',
      amountType: 'received',
      time: 'Yesterday',
      isNew: false
    },
    {
      id: 3,
      type: 'group',
      icon: Users,
      title: 'Mike T. created the group "Goa Trip 2026"',
      amount: null,
      time: 'May 12',
      isNew: false
    },
    {
      id: 4,
      type: 'expense',
      icon: Receipt,
      title: 'David L. added "Hotel booking" in Goa Trip 2026',
      amount: '₹80',
      amountType: 'borrowed',
      time: 'May 12',
      isNew: false
    },
    {
      id: 5,
      type: 'info',
      icon: Info,
      title: 'You updated your profile settings',
      amount: null,
      time: 'May 10',
      isNew: false
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity</h1>
        <p className="text-slate-500">Your recent history and notifications.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-4 p-4 sm:p-6 transition-colors hover:bg-slate-50 ${
                activity.isNew ? 'bg-brand-50/30' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                activity.type === 'expense' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'settle' ? 'bg-emerald-100 text-emerald-600' :
                activity.type === 'group' ? 'bg-indigo-100 text-indigo-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                <activity.icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <p className="font-medium text-slate-900 text-base leading-snug">
                    {activity.title}
                  </p>
                  <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
                
                {activity.amount && (
                  <p className={`text-sm mt-1 font-medium ${
                    activity.amountType === 'lent' || activity.amountType === 'received' 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {activity.amountType === 'lent' && 'You get back '}
                    {activity.amountType === 'borrowed' && 'You owe '}
                    {activity.amountType === 'received' && 'You received '}
                    {activity.amount}
                  </p>
                )}
              </div>
              
              {activity.isNew && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
