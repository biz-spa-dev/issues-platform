import { useState, useRef, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Issue, Assignee, Comment } from "../types/issue"
import { ASSIGNEES, STATUSES } from "../types/issue"
import { Edit2Icon, Trash2Icon, SendIcon } from "lucide-react"

interface CommentDrawerProps {
  isOpen: boolean
  onClose: () => void
  issue: Issue
  loggedUser: Assignee
  onAddComment: (comment: Comment) => void
  onEditComment: (commentId: number, newText: string) => void
  onDeleteComment: (commentId: number) => void
}

export default function CommentDrawer({
  isOpen,
  onClose,
  issue,
  loggedUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: CommentDrawerProps) {
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editedCommentText, setEditedCommentText] = useState("")
  const commentsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [isOpen])

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
      onAddComment(comment)
      setNewComment("")
    }
  }

  const handleEditComment = (commentId: number) => {
    const commentToEdit = issue.comments.find((comment) => comment.id === commentId)
    if (commentToEdit) {
      setEditingCommentId(commentId)
      setEditedCommentText(commentToEdit.text)
    }
  }

  const handleSaveEdit = () => {
    if (editingCommentId !== null) {
      onEditComment(editingCommentId, editedCommentText)
      setEditingCommentId(null)
      setEditedCommentText("")
    }
  }

  const getAssigneeColor = (assignee: Assignee) => {
    const colorClass = ASSIGNEES.find((a) => a.name === assignee)?.color || ""
    return (
      colorClass.replace("bg-", "bg-opacity-20 ") + " " + colorClass.replace("bg-", "text-").replace("-100", "-700")
    )
  }

  const getStatusColor = (status: string) => {
    return STATUSES.find((s) => s.label === status)?.color || ""
  }

  const isUserAdmin = ASSIGNEES.find((a) => a.name === loggedUser)?.isAdmin || false

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-[90%] sm:max-w-[600px] mx-auto h-[80vh]">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl">
            {issue.name} <span className={`... ${getStatusColor(issue.status)}`}>{issue.status}</span> -{" "}{issue.assignee}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4 flex-grow overflow-y-auto">
          {issue.comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg bg-white border border-black/10 max-w-[80%] relative group ${
                comment.assignee === loggedUser ? "ml-auto" : ""
              }`}
            >
              {editingCommentId === comment.id ? (
                <div>
                  <Input
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handleSaveEdit} size="sm">
                    Save
                  </Button>
                </div>
              ) : (
                <div className={`${getAssigneeColor(comment.assignee)}`}>
                  <div className="font-semibold">{comment.assignee}</div>
                  <div>{comment.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{comment.timestamp}</div>
                  {(isUserAdmin || comment.assignee === loggedUser) && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment.id)}>
                        <Edit2Icon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
        <DrawerFooter>
          <div className="flex space-x-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddComment()
                }
              }}
            />
            <Button onClick={handleAddComment}>
              <SendIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

