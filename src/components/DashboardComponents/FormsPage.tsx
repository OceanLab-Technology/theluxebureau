"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Download, Eye, Calendar, Filter } from "lucide-react"

const formSubmissions = [
  {
    id: "1",
    formName: "Contact Form",
    submitterName: "Sarah Johnson",
    submitterEmail: "sarah.johnson@email.com",
    subject: "Product Inquiry",
    message: "I'm interested in your luxury rose boxes...",
    submittedAt: "2025-07-26 10:30:00",
    status: "New",
  },
  {
    id: "2",
    formName: "Custom Order Form",
    submitterName: "Michael Chen",
    submitterEmail: "m.chen@company.com",
    subject: "Custom Gift Set",
    message: "Looking for a personalized gift set for corporate clients...",
    submittedAt: "2025-07-26 09:15:00",
    status: "In Progress",
  },
  {
    id: "3",
    formName: "Newsletter Signup",
    submitterName: "Emma Williams",
    submitterEmail: "emma.w@domain.com",
    subject: "Newsletter Subscription",
    message: "Please add me to your newsletter list",
    submittedAt: "2025-07-25 16:45:00",
    status: "Completed",
  },
  {
    id: "4",
    formName: "Partnership Inquiry",
    submitterName: "David Rodriguez",
    submitterEmail: "david.r@business.com",
    subject: "Business Partnership",
    message: "Interested in exploring partnership opportunities...",
    submittedAt: "2025-07-25 14:20:00",
    status: "New",
  },
  {
    id: "5",
    formName: "Return Request",
    submitterName: "Lisa Thompson",
    submitterEmail: "lisa.thompson@mail.com",
    subject: "Return Request #1234",
    message: "I would like to return my recent purchase...",
    submittedAt: "2025-07-25 11:30:00",
    status: "In Progress",
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "in progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

const truncateMessage = (message: string, maxLength: number = 50) => {
  return message.length > maxLength ? message.substring(0, maxLength) + "..." : message
}

export function FormsPage() {
  return (
    <div className="flex flex-col font-century">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-[200] font-century">Form Submissions</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Form Submissions</h2>
            <p className="text-muted-foreground">
              Manage customer inquiries and form submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formSubmissions.filter(form => form.status === "New").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formSubmissions.filter(form => form.status === "In Progress").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formSubmissions.filter(form => form.status === "Completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Type</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Submitted
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.formName}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.submitterName}</div>
                        <div className="text-sm text-muted-foreground">{submission.submitterEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <span title={submission.message}>
                        {truncateMessage(submission.message)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(submission.submittedAt).toLocaleDateString()} {new Date(submission.submittedAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={getStatusColor(submission.status)}
                        variant="secondary"
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
