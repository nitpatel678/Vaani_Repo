import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Input } from "../../../components/ui/Input"
import { Label } from "../../../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/Dialog"
import {
  MapPin,
  Flag,
  Eye,
  UserPlus,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  ImageIcon,
  Video,
  Play,
  Loader2,
  Building,
} from "lucide-react"
import { API_URL, SUPA_URL } from "../../constants"

export default function HeadDashboard() {
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    phone:"",
  })
  const [loading, setLoading] = useState(false)
  const [creatingEmployee, setCreatingEmployee] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState({})
  const [updatingFlag, setUpdatingFlag] = useState({})

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          console.warn("No token found in localStorage")
          setComplaints([])
          return
        }

        const res = await fetch(`${API_URL}/api/head/complaints`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          console.error("Failed to fetch complaints:", res.statusText)
          setComplaints([])
          return
        }

        const data = await res.json()

        // normalize complaints -> always have mediaFiles array
        const normalized = (Array.isArray(data?.reports) ? data.reports : []).map((c) => {
          const mediaFiles = []

          if (c.imageUrl) {
            mediaFiles.push({
              type: "image",
              url: `${SUPA_URL}/${c.imageUrl}`,
              name: c.imageUrl.split("/").pop(),
            })
          }

          if (Array.isArray(c.mediaUrl)) {
            c.mediaUrl.forEach((file) => {
              const ext = file.split(".").pop()
              let type = "file"
              if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) type = "image"
              if (["mp4", "mov", "avi"].includes(ext)) type = "video"
              if (["mp3", "wav"].includes(ext)) type = "audio"

              mediaFiles.push({
                type,
                url: `${SUPA_URL}/${file}`,
                name: file.split("/").pop(),
              })
            })
          }

          return { ...c, mediaFiles }
        })

        setComplaints(normalized)
      } catch (error) {
        console.error("Error fetching complaints:", error)
        setComplaints([])
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  // Employee Creation Handler
  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    setCreatingEmployee(true)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        console.error("No token found")
        alert("Authentication error. Please log in again.")
        return
      }

      const res = await fetch(`${API_URL}/api/head/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error("Failed to create employee:", res.statusText, errorData)
        alert(errorData.message || "Failed to create employee account. Please try again.")
        return
      }

      const data = await res.json()
      console.log("Employee created successfully:", data)
      
      alert("Employee account created successfully!")
      setNewEmployee({ name: "", email: "", role: "", department: "" })
      
    } catch (error) {
      console.error("Error creating employee:", error)
      alert("An error occurred while creating the employee account. Please try again.")
    } finally {
      setCreatingEmployee(false)
    }
  }

  // Status Change Handler with API call
  const handleStatusChange = async (complaintId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [complaintId]: true }))
    
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        console.error("No token found")
        return
      }

      const res = await fetch(`${API_URL}/api/head/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        console.error("Failed to update status:", res.statusText)
        return
      }

      // Update local state only if API call succeeds
      setComplaints((prev) =>
        prev.map((complaint) => 
          complaint._id === complaintId 
            ? { ...complaint, status: newStatus } 
            : complaint
        )
      )

      // Update selectedComplaint if it's the one being updated
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }))
      }

      console.log("Status updated successfully")
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: false }))
    }
  }

  // Flag Toggle Handler with API call
  const handleFlagToggle = async (complaintId) => {
    setUpdatingFlag(prev => ({ ...prev, [complaintId]: true }))
    
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        console.error("No token found")
        return
      }

      const complaint = complaints.find(c => c._id === complaintId)
      const newFlagStatus = !complaint.flag
      console.log("Calling:", `${API_URL}/api/head/complaints/${complaintId}/flag`)
      const res = await fetch(`${API_URL}/api/head/complaints/${complaintId}/flag`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        console.error("Failed to update flag:", res.statusText)
        return
      }

      // Update local state only if API call succeeds
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId 
            ? { ...complaint, flag: newFlagStatus } 
            : complaint
        )
      )

      // Update selectedComplaint if it's the one being updated
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, flag: newFlagStatus }))
      }

      console.log("Flag updated successfully")
    } catch (error) {
      console.error("Error updating flag:", error)
    } finally {
      setUpdatingFlag(prev => ({ ...prev, [complaintId]: false }))
    }
  }

  // Badge Helpers
  const getStatusBadge = (status) => {
    const variants = {
      pending: "destructive",
      "in-progress": "default",
      resolved: "secondary",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return <Badge className={colors[priority] || "bg-gray-100 text-gray-800"}>{priority}</Badge>
  }

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    flagged: complaints.filter((c) => c.flag).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.flagged}</p>
                  <p className="text-sm text-muted-foreground">Flagged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="complaints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="complaints">Manage Complaints</TabsTrigger>
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
          </TabsList>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle>All Complaints</CardTitle>
                <CardDescription>View, flag, and manage complaint statuses</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="border border-border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{complaint.title}</h3>
                            {complaint.flag && <Flag className="w-4 h-4 text-orange-600" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{complaint.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {complaint.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="w-4 h-4" />
                            {complaint.department.charAt(0).toUpperCase() + complaint.department.slice(1)}
                          </div>

                          {complaint.mediaFiles && complaint.mediaFiles.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex gap-1">
                                {complaint.mediaFiles.slice(0, 3).map((file, index) => (
                                  <div key={index} className="relative w-12 h-12 rounded border overflow-hidden">
                                    {file.type === "image" ? (
                                      <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <Video className="w-4 h-4 text-gray-600" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {complaint.mediaFiles.length} file{complaint.mediaFiles.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(complaint.status)}
                          {getPriorityBadge(complaint.priority)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleFlagToggle(complaint._id)}
                            disabled={updatingFlag[complaint._id]}
                          >
                            {updatingFlag[complaint._id] ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Flag className="w-4 h-4 mr-1" />
                            )}
                            {complaint.flag ? "Unflag" : "Flag"}
                          </Button>

                          <Dialog
                            onOpenChange={(open) => {
                              if (open) {
                                setSelectedComplaint(complaint)
                              } else {
                                setSelectedComplaint(null)
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Complaint Details</DialogTitle>
                                <DialogDescription>
                                  Manage complaint status and view evidence
                                </DialogDescription>
                              </DialogHeader>

                              {selectedComplaint && (
                                <div className="space-y-4">
                                  {/* Status */}
                                  <div>
                                    <Label>Status</Label>
                                    <Select
                                      value={selectedComplaint.status}
                                      onValueChange={(value) =>
                                        handleStatusChange(selectedComplaint._id, value)
                                      }
                                      disabled={updatingStatus[selectedComplaint._id]}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                        {updatingStatus[selectedComplaint._id] && (
                                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                        )}
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Description */}
                                  <div>
                                    <Label>Full Description</Label>
                                    <p className="text-sm bg-muted p-3 rounded-md mt-1">
                                      {selectedComplaint.description}
                                    </p>
                                  </div>

                                  {/* Evidence Files */}
                                  {selectedComplaint.mediaFiles &&
                                    selectedComplaint.mediaFiles.length > 0 && (
                                      <div>
                                        <Label>Evidence Files</Label>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                          {selectedComplaint.mediaFiles.map((file, index) => (
                                            <div key={index} className="space-y-2">
                                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                                                {file.type === "image" ? (
                                                  <img
                                                    src={file.url}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                  />
                                                ) : file.type === "video" ? (
                                                  <video controls className="w-full h-full object-cover">
                                                    <source src={file.url} type="video/mp4" />
                                                  </video>
                                                ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                                                    <Play className="w-8 h-8 text-white" />
                                                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                                                      {file.type.toUpperCase()}
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                              <p className="text-xs text-muted-foreground truncate">
                                                {file.name}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Management Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle>Create Employee Account</CardTitle>
                <CardDescription>Add new department officials to the system</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4" onSubmit={handleCreateEmployee}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        required
                        disabled={creatingEmployee}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        required
                        disabled={creatingEmployee}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter the password"
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                        required
                        disabled={creatingEmployee}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newEmployee.role}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                        required
                        disabled={creatingEmployee}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="department">Department Official</SelectItem>
                          <SelectItem value="head">Head Official</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="Phone">Phone</Label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="Enter the phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        required
                        disabled={creatingEmployee}
                      />
                    </div>

                  <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newEmployee.department}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                        required
                        disabled={creatingEmployee}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="roads">Roads & Infrastructure</SelectItem>
                          <SelectItem value="sanitation">Sanitation & Waste</SelectItem>
                          <SelectItem value="lighting">Street Lighting</SelectItem>
                          <SelectItem value="water">Water & Drainage</SelectItem>
                          <SelectItem value="parks">Parks & Recreation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>

                  <Button type="submit" className="w-full" disabled={creatingEmployee}>
                    {creatingEmployee ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    {creatingEmployee ? "Creating Account..." : "Create Employee Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}