import type { Activity } from '../../types';

interface ActivityItemProps {
  activity: Activity;
  currentUserId: string;
}

export default function ActivityItem({ activity, currentUserId }: ActivityItemProps) {
  const isPayer = activity.payerId === currentUserId;
  return (
    <div className="py-4 flex items-center justify-between">
      <div>
        <p className="font-medium text-surface-900">{activity.description}</p>
        <p className="text-sm text-surface-500">{activity.date}</p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isPayer ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPayer ? '+' : '-'}${activity.amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
