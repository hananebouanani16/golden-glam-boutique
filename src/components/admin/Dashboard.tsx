
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Users, MapPin, Package, CheckCircle, XCircle } from "lucide-react";

const Dashboard = () => {
  const { getOrderStats } = useOrders();
  const stats = getOrderStats();

  const statusData = [
    { name: 'Confirmées', value: stats.confirmedOrders, color: '#10b981' },
    { name: 'Annulées', value: stats.cancelledOrders, color: '#ef4444' },
    { name: 'En attente', value: stats.totalOrders - stats.confirmedOrders - stats.cancelledOrders, color: '#6b7280' }
  ];

  const chartConfig = {
    confirmed: {
      label: "Confirmées",
      color: "#10b981",
    },
    cancelled: {
      label: "Annulées", 
      color: "#ef4444",
    },
    pending: {
      label: "En attente",
      color: "#6b7280",
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gold-text">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold-300">Total Commandes</CardTitle>
            <Package className="h-4 w-4 text-gold-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold-300">Commandes Validées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.confirmedOrders}</div>
            <p className="text-xs text-gray-400">
              {stats.totalOrders > 0 ? Math.round((stats.confirmedOrders / stats.totalOrders) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gold-300">Commandes Annulées</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.cancelledOrders}</div>
            <p className="text-xs text-gray-400">
              {stats.totalOrders > 0 ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader>
            <CardTitle className="gold-text">Répartition des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<ChartTooltipContent />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Wilayas Chart */}
        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader>
            <CardTitle className="gold-text flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Top Wilayas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topWilayas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="wilaya" 
                    stroke="#d1d5db"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #d4af37',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader>
            <CardTitle className="gold-text flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCustomers.length > 0 ? (
                stats.topCustomers.map((customer, index) => (
                  <div key={customer.phone} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{customer.name}</div>
                      <div className="text-sm text-gray-400">{customer.phone}</div>
                    </div>
                    <div className="text-gold-400 font-semibold">
                      {customer.orders} commande{customer.orders > 1 ? 's' : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Wilayas List */}
        <Card className="bg-gray-800 border-gold-500/20">
          <CardHeader>
            <CardTitle className="gold-text flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Wilayas les Plus Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topWilayas.length > 0 ? (
                stats.topWilayas.map((wilaya, index) => (
                  <div key={wilaya.wilaya} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gold-500 text-black rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div className="font-medium text-white">{wilaya.wilaya}</div>
                    </div>
                    <div className="text-gold-400 font-semibold">
                      {wilaya.count} commande{wilaya.count > 1 ? 's' : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
