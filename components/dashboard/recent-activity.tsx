import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const activities = [
  {
    id: 1,
    type: 'User Created',
    description: 'New user account created',
    time: '2 hours ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'Farm Added',
    description: 'New farm registered to system',
    time: '4 hours ago',
    status: 'success',
  },
  {
    id: 3,
    type: 'Employee Alert',
    description: 'Employee attendance marked',
    time: '6 hours ago',
    status: 'info',
  },
  {
    id: 4,
    type: 'Sales Recorded',
    description: 'New sales transaction completed',
    time: '8 hours ago',
    status: 'success',
  },
  {
    id: 5,
    type: 'Inventory Update',
    description: 'Stock levels updated',
    time: '1 day ago',
    status: 'warning',
  },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
            <div className="flex-1">
              <p className="font-medium text-sm">{activity.type}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  activity.status === 'success'
                    ? 'default'
                    : activity.status === 'warning'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {activity.status}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
