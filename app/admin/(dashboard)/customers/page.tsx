"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Calendar,
  Phone,
  Mail,
  Loader2,
  TrendingUp,
  UserCheck,
  Scissors,
  Trash2
} from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";
import { confirmAction } from "@/utils/helpers/alertHelper";
import toast from "react-hot-toast";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  bookingsCount: number;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { getMethod, deleteMethod } = BasicProvider();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getMethod("/api/customers");
      if (data && data.success) {
        setCustomers(data.customers);
      } else {
        toast.error(data.message || "Failed to load customers.");
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    const isConfirmed = await confirmAction(
      "Are you sure?",
      `Do you want to permanently delete customer ${name}?`,
      "Delete"
    );
    if (!isConfirmed) return;

    try {
      setLoading(true);
      const data = await deleteMethod(`/api/customers/${id}`);
      if (data && data.success) {
        toast.success(data.message || "Customer deleted successfully.");
        fetchCustomers();
      } else {
        toast.error(data.message || "Failed to delete customer.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to delete customer:", err);
      toast.error("Failed to connect to the server.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCustomers();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.bookingsCount > 0).length;
  const totalBookings = customers.reduce((sum, c) => sum + c.bookingsCount, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <Loader2 className="h-8 w-8 text-gold animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-gold font-semibold">
          Fetching customer base...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-gradient-gold leading-none">
          Customer Directory
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
          Monitor and search registered salon clients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="glass p-6 rounded-3xl border border-gold/15 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Total Clients
            </p>
            <h3 className="font-display text-2xl font-bold text-gradient-gold">
              {totalCustomers}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-gold/15 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Active Clients
            </p>
            <h3 className="font-display text-2xl font-bold text-gradient-gold">
              {activeCustomers}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-gold/15 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Total Bookings
            </p>
            <h3 className="font-display text-2xl font-bold text-gradient-gold">
              {totalBookings}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="glass rounded-3xl border border-gold/10 overflow-hidden">
        <div className="p-6 border-b border-gold/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/60" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/45 border border-gold/15 rounded-2xl py-3 pl-11 pr-4 text-xs placeholder:text-muted-foreground/45 focus:border-gold/45 focus:outline-none transition-colors text-foreground"
            />
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Showing {filteredCustomers.length} of {totalCustomers} customers
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-semibold">
            <Scissors className="h-10 w-10 text-gold/30 mx-auto mb-3" />
            <p className="text-sm">No customers matched your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gold/10 text-[10px] text-gold uppercase tracking-widest bg-gold/5">
                  <th className="py-4 px-6 font-bold">Client Name</th>
                  <th className="py-4 px-6 font-bold">Phone Number</th>
                  <th className="py-4 px-6 font-bold">Email</th>
                  <th className="py-4 px-6 font-bold">Registered Date</th>
                  <th className="py-4 px-6 font-bold text-right">Appointments</th>
                  <th className="py-4 px-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5 text-xs">
                {filteredCustomers.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gold/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/15 font-display text-[10px] font-bold text-gold shrink-0">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gold/50" />
                        +91 {c.phone}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {c.email ? (
                        <span className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gold/50" />
                          {c.email}
                        </span>
                      ) : (
                        <span className="italic text-muted-foreground/45">Not provided</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gold/50" />
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gradient-gold">
                      {c.bookingsCount}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteCustomer(c._id, c.name)}
                        className="p-1.5 bg-destructive/10 border border-destructive/25 rounded hover:bg-destructive hover:text-white text-destructive-foreground transition-colors cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
