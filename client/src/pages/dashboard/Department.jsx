import { useState, useEffect } from "react"
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs'
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,} from '../../../components/ui/Dialog'
import { Label } from '../../../components/ui/Label'
import { Textarea } from '../../../components/ui/Textarea'
import { Input } from '../../../components/ui/Input'
import { API_URL, SUPA_URL } from "../../constants"
import { MapPin, Eye, CheckCircle, Clock, AlertTriangle, LogOut, Wrench, Upload, Video, Play, Loader2, AlertCircle,
  Flag,
  UserPlus,
  FileText,
  TrendingUp,
  ImageIcon,
  Building,
 } from "lucide-react"


export default function DepartmentDashboard() {
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [workNotes, setWorkNotes] = useState("")
  const [completionImage, setCompletionImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [complaints, setComplaints] = useState([])
  const [error, setError] = useState(null)
  const [authError, setAuthError] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchComplaints()
  }, [])
  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    setAuthError(false)

    try {
      const token = localStorage.getItem("token")
      
      // Check if token exists
      if (!token) {
        setAuthError(true)
        setError("No authentication token found. Please log in again.")
        return
      }

      const response = await fetch(`${API_URL}/api/department/complaints`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Handle specific HTTP status codes
      if (response.status === 401) {
        setAuthError(true)
        setError("Session expired. Please log in again.")
        localStorage.removeItem("token")
        return
      }

      if (response.status === 403) {
        setAuthError(true)
        setError("Access denied. You don't have permission to view department complaints.")
        return
      }

      if (response.status === 404) {
        setError("Department complaints endpoint not found. Please contact support.")
        return
      }

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // If can't parse JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("Successfully fetched complaints:", data)
      
      // Handle different response formats and normalize data
      let complaintsArray = []
      if (Array.isArray(data)) {
        complaintsArray = data
      } else if (data.reports && Array.isArray(data.reports)) {
        complaintsArray = data.reports
      } else if (data.data && Array.isArray(data.data)) {
        complaintsArray = data.data
      } else if (data.complaints && Array.isArray(data.complaints)) {
        complaintsArray = data.complaints
      }

      // Normalize complaints with media files
      const normalized = complaintsArray.map((c) => {
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

        return { 
          ...c, 
          mediaFiles,
          // Ensure consistent field naming
          id: c._id || c.id,
        }
      })

      setComplaints(normalized)

    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(`Failed to fetch complaints: ${err.message}`);
      
      // Only use mock data in development for testing
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV === 'development') {
        console.log("Using mock data for development")
        
      }
    } finally {
      setLoading(false)
    }
  } 
   
  const handleStatusChange = async (complaintId, newStatus, notes = "", image = null) => {
    setUpdatingStatus(prev => ({ ...prev, [complaintId]: true }))
    
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("No authentication token found. Please log in again.")
        return
      }

      

      // Check if resolving without completion image
      if (newStatus === "resolved" && !image && !complaints.find((c) => c._id === complaintId)?.completionImage) {
        setError("Please upload completion proof image before marking as resolved")
        return
      }

      // Create FormData for file upload if needed
      let body, headers
      
      if (image || notes) {
        // Use FormData when we have image or notes
        const formData = new FormData()
        formData.append('status', newStatus)
        if (notes) formData.append('workNotes', notes)
        if (image) formData.append('completionImage', image)
        
        body = formData
        headers = {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - let browser set it
        }
      } else {
        // Use JSON for simple status updates
        body = JSON.stringify({ status: newStatus })
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }

      const res = await fetch(`${API_URL}/api/department/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers,
        body,
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Failed to update status:", res.statusText, errorText)
        setError(`Failed to update complaint: ${res.statusText}`)
        return
      }

      const updatedComplaint = await res.json()

      // Update local state with the response data
      setComplaints((prev) =>
        prev.map((complaint) => 
          complaint._id === complaintId 
            ? { 
                ...complaint, 
                status: newStatus,
                workNotes: notes || complaint.workNotes,
                completionImage: image ? URL.createObjectURL(image) : complaint.completionImage
              } 
            : complaint
        )
      )

      // Update selectedComplaint if it's the one being updated
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint(prev => ({ 
          ...prev, 
          status: newStatus,
          workNotes: notes || prev.workNotes,
          completionImage: image ? URL.createObjectURL(image) : prev.completionImage
        }))
      }

      // Close dialog on successful update
      setIsDialogOpen(false)
      
      // Reset form fields
      setWorkNotes("")
      setCompletionImage(null)
      setImagePreview(null)

      console.log("Status updated successfully")
    } catch (error) {
      console.error("Error updating status:", error)
      setError(`Failed to update complaint: ${error.message}`)
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: false }))
    }
  }

  

  const getStatusBadge = (status) => {
    const variants = {
      pending: "destructive",
      "assigned-team": "secondary",
      "in-progress": "default",
      resolved: "secondary",
    }
    const labels = {
      pending: "Pending",
      "in-progress": "In Progress",
      resolved: "Resolved",
    }
    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return <Badge className={colors[priority] || "bg-gray-100 text-gray-800"}>{priority}</Badge>
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setCompletionImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRetry = () => {
    fetchComplaints()
  }

  const handleLogin = () => {
    // Redirect to login page or show login modal
    window.location.href = '/login'
  }

 

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50" >
      <h1 className="text-2xl font-semibold mb-6">Department Dashboard</h1>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <div className="flex gap-2 mt-4">
              {authError ? (
                <Button onClick={handleLogin} variant="outline" size="sm">
                  Go to Login
                </Button>
              ) : (
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Retry
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats - Same style as Head Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

          
        </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl" >
          <CardTitle>Your Assigned Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading complaints...
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No complaints found.</p>
              {!error && (
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            <ul className="space-y-4">
              {complaints.map((complaint) => (
                <li
                  key={complaint.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{complaint.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Location:</span> {complaint.location}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">Department:</span> {complaint.department.charAt(0).toUpperCase() + complaint.department.slice(1)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(complaint.status)}
                      {getPriorityBadge(complaint.priority)}
                    </div>
                  </div>

                  {/* Media Files Display */}
                  {complaint.mediaFiles && complaint.mediaFiles.length > 0 && (
                    <div className="mt-3 flex gap-3 flex-wrap">
                      {complaint.mediaFiles.map((file, i) => {
                        if (file.name && file.name.endsWith(".mp4")) {
                          return (
                            <video
                              key={i}
                              src={file.url}
                              controls
                              className="w-40 h-24 rounded-lg border"
                            />
                          )
                        }
                        if (file.name && file.name.endsWith(".mp3")) {
                          return (
                            <audio
                              key={i}
                              src={file.url}
                              controls
                              className="w-full"
                            />
                          )
                        }
                        if (file.type === "image" || (file.name && !file.name.endsWith(".mp4") && !file.name.endsWith(".mp3"))) {
                          return (
                            <img
                              key={i}
                              src={file.url || "/placeholder.svg"}
                              alt="Complaint"
                              className="mt-3 w-full max-h-48 object-cover rounded-lg"
                            />
                          )
                        }
                        return null
                      })}
                    </div>
                  )}

                  {/* Bottom section with ID, date and manage button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      ID: {complaint.id} • Submitted: {new Date(complaint.submittedAt).toLocaleDateString()}
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(complaint)
                            setWorkNotes(complaint.workNotes || "")
                            setCompletionImage(null)
                            setImagePreview(null)
                            setError(null)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Manage Complaint</DialogTitle>
                          <DialogDescription>Update status and add work notes</DialogDescription>
                        </DialogHeader>
                        {selectedComplaint && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Current Status</Label>
                                <Select
                                  value={selectedComplaint.status}
                                  onValueChange={(value) => {
                                    setSelectedComplaint({ ...selectedComplaint, status: value })
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Priority Level</Label>
                                <div className="mt-2">{getPriorityBadge(selectedComplaint.priority)}</div>
                              </div>
                            </div>
                            <div>
                              <Label>Complaint Details</Label>
                              <div className="bg-muted p-3 rounded-md mt-1">
                                <p className="text-sm">{selectedComplaint.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Location: {selectedComplaint.location}
                                </p>
                              </div>
                            </div>
                            {selectedComplaint.mediaFiles && selectedComplaint.mediaFiles.length > 0 && (
                              <div>
                                <Label>Citizen Evidence Files</Label>
                                <div className="mt-3 flex gap-3 flex-wrap">
                                  {selectedComplaint.mediaFiles.map((file, i) => {
                                    if (file.name && file.name.endsWith(".mp4")) {
                                      return (
                                        <video
                                          key={i}
                                          src={file.url}
                                          controls
                                          className="w-40 h-24 rounded-lg border"
                                        />
                                      )
                                    }
                                    if (file.name && file.name.endsWith(".mp3")) {
                                      return (
                                        <audio
                                          key={i}
                                          src={file.url}
                                          controls
                                          className="w-full"
                                        />
                                      )
                                    }
                                    if (file.type === "image" || (file.name && !file.name.endsWith(".mp4") && !file.name.endsWith(".mp3"))) {
                                      return (
                                        <img
                                          key={i}
                                          src={file.url || "/placeholder.svg"}
                                          alt="Complaint"
                                          className="mt-3 w-full max-h-48 object-cover rounded-lg"
                                        />
                                      )
                                    }
                                    return null
                                  })}
                                </div>
                              </div>
                            )}
                            <div>
                              <Label htmlFor="workNotes">Work Notes</Label>
                              <Textarea
                                id="workNotes"
                                placeholder="Add notes about work progress, materials needed, etc..."
                                value={workNotes}
                                onChange={(e) => setWorkNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                            {selectedComplaint.status === "resolved" && (
                              <div className="space-y-2">
                                <Label>Completion Proof Image *</Label>
                                <p className="text-sm text-muted-foreground">
                                  Upload an image showing the completed work as proof before marking as resolved.
                                </p>
                                <div className="flex items-center gap-4">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="flex-1"
                                  />
                                  <Upload className="w-5 h-5 text-muted-foreground" />
                                </div>
                                {imagePreview && (
                                  <div className="mt-2">
                                    <img
                                      src={imagePreview}
                                      alt="Completion proof"
                                      className="w-full max-w-sm h-32 object-cover rounded-md border"
                                    />
                                  </div>
                                )}
                                {selectedComplaint.completionImage && !imagePreview && (
                                  <div className="mt-2">
                                    <img
                                      src={selectedComplaint.completionImage}
                                      alt="Existing completion proof"
                                      className="w-full max-w-sm h-32 object-cover rounded-md border"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Current completion image</p>
                                  </div>
                                )}
                              </div>
                            )}
                            <Button
  onClick={() =>
    handleStatusChange(
      selectedComplaint.id || selectedComplaint._id,
      selectedComplaint.status,
      workNotes,
      completionImage
    )
  }
  className="w-full"
  disabled={updatingStatus[selectedComplaint.id || selectedComplaint._id]}
>

                              {updatingStatus[selectedComplaint.id || selectedComplaint._id] ? (
                                <>
                                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                  Updating...
                                </>
                              ) : (
                                "Update Complaint"
                              )}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}