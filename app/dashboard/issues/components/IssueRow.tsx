'use client'

import type { Issue, IssueStatus, Assignee, IssueType } from "../types/issue"
import { ASSIGNEES, STATUSES } from "../types/issue"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FileIcon,
  MessageSquareIcon,
  ImageIcon,
  TrashIcon,
  PlusIcon,
  CopyIcon,
  PencilIcon,
  XIcon,
  CheckIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CommentDrawer from "./CommentDrawer"
import PhotosModal from "./PhotosModal"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface IssueRowProps {
  issue: Issue
  onEdit: (updatedIssue: Issue) => void
  onDelete: (id: number) => void
  loggedUser: Assignee
}

interface Comment {
  id: number
  text: string
  assignee: Assignee
  timestamp: string
}

export default function IssueRow({ issue, onEdit, onDelete, loggedUser }: IssueRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false)
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false)
  const [fieldToUpdate, setFieldToUpdate] = useState<"type" | "status" | "assignee" | null>(null)
  const [newValue, setNewValue] = useState<string>("")
  const [newFilePath, setNewFilePath] = useState("")
  const [isFullSizePhotoModalOpen, setIsFullSizePhotoModalOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingElementCommandName, setIsEditingElementCommandName] = useState(false)
  const [editedName, setEditedName] = useState(issue.name)
  const [editedDescription, setEditedDescription] = useState(issue.description)
  const [editedElementCommandName, setEditedElementCommandName] = useState(issue.elementCommandName)
  const [newComment, setNewComment] = useState("")

  const handleRowClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleQuickEdit = (field: "type" | "status" | "assignee", value: string) => {
    setFieldToUpdate(field)
    setNewValue(value)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmQuickEdit = () => {
    if (fieldToUpdate) {
      const updatedIssue = {
        ...issue,
        [fieldToUpdate]: newValue,
        dateUpdated: new Date()
          .toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(",", " -"),
      }
      onEdit(updatedIssue)
    }
    setIsConfirmDialogOpen(false)
  }

  const handleAddFilePath = (newFilePath: string) => {
    if (newFilePath) {
      const updatedIssue = {
        ...issue,
        filePaths: [...issue.filePaths, newFilePath],
        dateUpdated: new Date()
          .toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(",", " -"),
      }
      onEdit(updatedIssue)
      setNewFilePath("")
    }
  }

  const handleUpdateFilePath = (index: number, value: string) => {
    const updatedFilePaths = [...issue.filePaths]
    updatedFilePaths[index] = value
    const updatedIssue = {
      ...issue,
      filePaths: updatedFilePaths,
      dateUpdated: new Date()
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(",", " -"),
    }
    onEdit(updatedIssue)
  }

  const handleDeleteFilePath = (index: number) => {
    const updatedFilePaths = issue.filePaths.filter((_, i) => i !== index)
    const updatedIssue = {
      ...issue,
      filePaths: updatedFilePaths,
      dateUpdated: new Date()
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(",", " -"),
    }
    onEdit(updatedIssue)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        text: newComment.trim(),
        assignee: loggedUser,
        timestamp: new Date()
          .toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(",", " -"),
      }
      const updatedIssue = {
        ...issue,
        comments: [...issue.comments, comment],
        dateUpdated: new Date()
          .toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(",", " -"),
      }
      onEdit(updatedIssue)
      setNewComment("")
      setIsCommentDrawerOpen(true)
    }
  }

  const handleEditComment = (commentId: number, newText: string) => {
    const updatedComments = issue.comments.map((comment) =>
      comment.id === commentId ? { ...comment, text: newText } : comment,
    )
    const updatedIssue = {
      ...issue,
      comments: updatedComments,
      dateUpdated: new Date()
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(",", " -"),
    }
    onEdit(updatedIssue)
  }

  const handleDeleteComment = (commentId: number) => {
    const updatedComments = issue.comments.filter((comment) => comment.id !== commentId)
    const updatedIssue = {
      ...issue,
      comments: updatedComments,
      dateUpdated: new Date()
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(",", " -"),
    }
    onEdit(updatedIssue)
  }

  const getStatusColor = (status: IssueStatus) => {
    return STATUSES.find((s) => s.label === status)?.color || ""
  }

  const getAssigneeColor = (assignee: Assignee) => {
    return ASSIGNEES.find((a) => a.name === assignee)?.color || ""
  }

  const handleSaveEdit = (field: "name" | "description" | "elementCommandName") => {
    const updatedIssue = {
      ...issue,
      [field]: field === "name" ? editedName : field === "description" ? editedDescription : editedElementCommandName,
      dateUpdated: new Date()
        .toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(",", " -"),
    }
    onEdit(updatedIssue)
    setIsEditingName(false)
    setIsEditingDescription(false)
    setIsEditingElementCommandName(false)
  }

  const FilePathManager = ({
    filePaths,
    onAddFilePath,
    onUpdateFilePath,
    onDeleteFilePath,
  }: {
    filePaths: string[]
    onAddFilePath: (path: string) => void
    onUpdateFilePath: (index: number, value: string) => void
    onDeleteFilePath: (index: number) => void
  }) => {
    const [newFilePath, setNewFilePath] = useState("")

    return (
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        {filePaths.map((path, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={path}
              onChange={(e) => onUpdateFilePath(index, e.target.value)}
              className="flex-grow"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(path)
              }}
              variant="ghost"
              size="sm"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteFilePath(index)
              }}
              variant="ghost"
              size="sm"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <Input
            value={newFilePath}
            onChange={(e) => setNewFilePath(e.target.value)}
            placeholder="Add new file path"
            className="flex-grow"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onAddFilePath(newFilePath)
              setNewFilePath("")
            }}
            variant="outline"
            size="sm"
          >
            Add
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 cursor-pointer" onClick={handleRowClick}>
        <td className="py-3 px-6 text-left whitespace-nowrap">{issue.id}</td>
        <td className="py-3 px-6 text-left" onClick={(e) => e.stopPropagation()}>
          <Select value={issue.type} onValueChange={(value) => handleQuickEdit("type", value as IssueType)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Functionality">Functionality</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Translations">Translations</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-6 text-left">{issue.name}</td>
        <td className="py-3 px-6 text-left" onClick={(e) => e.stopPropagation()}>
          <Select value={issue.status} onValueChange={(value) => handleQuickEdit("status", value as IssueStatus)}>
            <SelectTrigger className={`w-[120px] ${getStatusColor(issue.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.label} value={status.label} className={status.color}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-6 text-left" onClick={(e) => e.stopPropagation()}>
          <Select value={issue.assignee} onValueChange={(value) => handleQuickEdit("assignee", value as Assignee)}>
            <SelectTrigger className={`w-[120px] ${getAssigneeColor(issue.assignee)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNEES.map((assignee) => (
                <SelectItem key={assignee.name} value={assignee.name} className={assignee.color}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="py-3 px-6 text-left">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                <FileIcon className="h-4 w-4 mr-2" />
                {issue.filePaths.length}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
              <FilePathManager
                filePaths={issue.filePaths}
                onAddFilePath={handleAddFilePath}
                onUpdateFilePath={handleUpdateFilePath}
                onDeleteFilePath={handleDeleteFilePath}
              />
            </PopoverContent>
          </Popover>
        </td>
        <td className="py-3 px-6 text-left">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsCommentDrawerOpen(true)
            }}
          >
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            {issue.comments.length}
          </Button>
        </td>
        <td className="py-3 px-6 text-left">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsPhotosModalOpen(true)
            }}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {issue.photos.length}
          </Button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={11} className="bg-muted/50 p-4">
            <div className="flex">
              <div className="w-3/5 pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select value={issue.type} onValueChange={(value) => handleQuickEdit("type", value as IssueType)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Functionality">Functionality</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Translations">Translations</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={issue.status}
                        onValueChange={(value) => handleQuickEdit("status", value as IssueStatus)}
                      >
                        <SelectTrigger className={`w-[120px] ${getStatusColor(issue.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status.label} value={status.label} className={status.color}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={issue.assignee}
                        onValueChange={(value) => handleQuickEdit("assignee", value as Assignee)}
                      >
                        <SelectTrigger className={`w-[120px] ${getAssigneeColor(issue.assignee)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSIGNEES.map((assignee) => (
                            <SelectItem key={assignee.name} value={assignee.name} className={assignee.color}>
                              {assignee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Date Added: {issue.dateOpened}</span>
                      <span>Last Updated: {issue.dateUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                            <Input
                              id="issueName"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onBlur={() => handleSaveEdit("name")}
                              className="flex-grow"
                            />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description:</h4>
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      onBlur={() => handleSaveEdit("description")}
                      className="w-full"
                      rows={4}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Add Comment:</h4>
                    <div className="flex space-x-2">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your comment..."
                        className="flex-grow"
                      />
                      <Button onClick={handleAddComment}>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/5 pl-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">File Paths:</h4>
                    <FilePathManager
                      filePaths={issue.filePaths}
                      onAddFilePath={handleAddFilePath}
                      onUpdateFilePath={handleUpdateFilePath}
                      onDeleteFilePath={handleDeleteFilePath}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Photos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {issue.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`Issue photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded cursor-pointer"
                          onClick={() => {
                            setSelectedPhoto(photo)
                            setIsFullSizePhotoModalOpen(true)
                          }}
                        />
                      ))}
                      <div
                        className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer"
                        onClick={() => setIsPhotosModalOpen(true)}
                      >
                        <PlusIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to change the {fieldToUpdate} to {newValue}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmQuickEdit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CommentDrawer
        isOpen={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
        issue={issue}
        loggedUser={loggedUser}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
      <PhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        photos={issue.photos}
        onUpdatePhotos={(updatedPhotos) => {
          const updatedIssue = {
            ...issue,
            photos: updatedPhotos,
            dateUpdated: new Date()
              .toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(",", " -"),
          }
          onEdit(updatedIssue)
        }}
      />
      <Dialog open={isFullSizePhotoModalOpen} onOpenChange={setIsFullSizePhotoModalOpen}>
        <DialogContent className="max-w-[80vw] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Full Size Photo</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={selectedPhoto || "/placeholder.svg"}
              alt="Full size photo"
              className="max-w-full max-h-[calc(80vh-100px)] object-contain"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsFullSizePhotoModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

