import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { StatCard } from '@/components/StatCard'
import { Card } from '@/components/Card'
import { formatCurrency } from '@/utils/format'

const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#dc2626']

export default function Statistics() {
  const { items } = useWardrobeData()

  const wornData = useMemo(
    () =>
      [...items]
        .sort((a, b) => b.timesWorn - a.timesWorn)
        .slice(0, 8)
        .map((i) => ({ name: i.name, worn: i.timesWorn })),
    [items],
  )

  const leastWorn = useMemo(
    () =>
      [...items]
        .sort((a, b) => a.timesWorn - b.timesWorn)
        .slice(0, 8)
        .map((i) => ({ name: i.name, worn: i.timesWorn })),
    [items],
  )

  const brandData = useMemo(() => {
    const counts = new Map<string, number>()
    items.forEach((i) => {
      if (!i.brand) return
      counts.set(i.brand, (counts.get(i.brand) ?? 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [items])

  const colorData = useMemo(() => {
    const counts = new Map<string, number>()
    items.forEach((i) => {
      const name = i.color.name || i.color.hex
      counts.set(name, (counts.get(name) ?? 0) + 1)
    })
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
  }, [items])

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>()
    items.forEach((i) => counts.set(i.category, (counts.get(i.category) ?? 0) + 1))
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
  }, [items])

  const totalValue = items.reduce((sum, i) => sum + (i.purchasePrice ?? 0), 0)
  const pricedItems = items.filter((i) => i.purchasePrice != null)
  const avgCost = pricedItems.length ? totalValue / pricedItems.length : 0

  return (
    <div className="space-y-6 py-2">
      <h1 className="text-2xl font-bold">Statistics</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Items" value={items.length} icon="👕" />
        <StatCard label="Total Value" value={formatCurrency(totalValue)} icon="💰" />
        <StatCard label="Average Cost" value={formatCurrency(avgCost)} icon="📈" />
        <StatCard label="Favorites" value={items.filter((i) => i.favorite).length} icon="♥" />
      </div>

      <ChartCard title="Most worn items">
        <BarChart data={wornData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" hide />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="worn" fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Least worn items">
        <BarChart data={leastWorn}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" hide />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="worn" fill="#db2777" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Favorite brands">
        <BarChart data={brandData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="brand" hide />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#0891b2" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ChartCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <ChartCard title="Color distribution">
          <PieChart>
            <Pie data={colorData} dataKey="value" nameKey="name" outerRadius={90} label>
              {colorData.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
        <ChartCard title="Category distribution">
          <PieChart>
            <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} label>
              {categoryData.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
