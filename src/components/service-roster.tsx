'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { ServiceRoster as ServiceRosterType } from '@/types/database'
import { Plus, Trash2, ToggleLeft, ToggleRight, Phone, Mail, Edit2, Users, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

const ROLE_TYPES = [
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'sponsee', label: 'Sponsee' },
  { value: 'accountability_partner', label: 'Accountability Partner' },
  { value: 'meeting_role', label: 'Meeting Role' },
  { value: 'service_commitment', label: 'Service Commitment' },
]

const DEFAULT_CONTACTS = [
  { 
    role_type: 'sponsor',
    name: 'My Sponsor',
    contact: 'phone: 555-0100',
    notes: 'Call daily before 9pm',
    schedule: 'Daily check-ins',
  },
  { 
    role_type: 'accountability_partner',
    name: 'Recovery Buddy',
    contact: 'phone: 555-0200',
    notes: 'Text anytime for support',
    schedule: 'As needed',
  },
  { 
    role_type: 'meeting_role',
    name: 'Wednesday Meeting Greeter',
    contact: '',
    notes: 'Arrive 15 min early',
    schedule: 'Weekly on Wednesday 7pm',
  },
]

export function ServiceRoster() {
  const [contacts, setContacts] = useState<ServiceRosterType[]>([])
  const [showDefaults, setShowDefaults] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editingContact, setEditingContact] = useState<ServiceRosterType | null>(null)
  const [filterRole, setFilterRole] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    role_type: 'sponsor',
    contact: '',
    schedule: '',
    notes: '',
  })
  const supabase = createClient()

  useEffect(() => {
    loadContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadContacts() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('service_roster')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setContacts(data)
      if (data.length === 0) {
        setShowDefaults(true)
      }
    }
    setLoading(false)
  }

  async function addAllDefaults() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('service_roster')
      .insert(
        DEFAULT_CONTACTS.map(contact => ({
          user_id: user.id,
          ...contact,
          active: true,
        }))
      )

    if (error) {
      toast.error('Failed to add default contacts')
      return
    }

    toast.success('Default contacts added!')
    setShowDefaults(false)
    loadContacts()
  }

  async function saveContact() {
    if (!formData.name || !formData.role_type) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editingContact) {
      const { error } = await supabase
        .from('service_roster')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingContact.id)

      if (error) {
        toast.error('Failed to update contact')
        return
      }

      toast.success('Contact updated!')
    } else {
      const { error } = await supabase
        .from('service_roster')
        .insert({
          user_id: user.id,
          ...formData,
          active: true,
        })

      if (error) {
        toast.error('Failed to add contact')
        return
      }

      toast.success('Contact added!')
    }

    resetForm()
    loadContacts()
  }

  async function toggleActive(contact: ServiceRosterType) {
    const { error } = await supabase
      .from('service_roster')
      .update({ 
        active: !contact.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contact.id)

    if (error) {
      toast.error('Failed to update contact')
      return
    }

    setContacts(contacts.map(c => c.id === contact.id ? { ...c, active: !c.active } : c))
  }

  async function deleteContact(id: string) {
    const { error } = await supabase
      .from('service_roster')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete contact')
      return
    }

    toast.success('Contact deleted')
    setContacts(contacts.filter(c => c.id !== id))
  }

  function openEditDialog(contact: ServiceRosterType) {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      role_type: contact.role_type,
      contact: contact.contact || '',
      schedule: contact.schedule || '',
      notes: contact.notes || '',
    })
    setShowDialog(true)
  }

  function openAddDialog() {
    resetForm()
    setShowDialog(true)
  }

  function resetForm() {
    setEditingContact(null)
    setFormData({
      name: '',
      role_type: 'sponsor',
      contact: '',
      schedule: '',
      notes: '',
    })
    setShowDialog(false)
  }

  function parseContact(contact: string) {
    if (!contact) return null
    const emailMatch = contact.match(/email:\s*([\w\.-]+@[\w\.-]+\.\w+)/i)
    const phoneMatch = contact.match(/phone:\s*([\d\-\(\)\s]+)/i)
    
    if (emailMatch) return { type: 'email', value: emailMatch[1] }
    if (phoneMatch) return { type: 'phone', value: phoneMatch[1] }
    
    if (contact.includes('@')) return { type: 'email', value: contact }
    if (/[\d\-\(\)]/.test(contact)) return { type: 'phone', value: contact }
    
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service & Accountability Roster</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const filteredContacts = filterRole === 'all' 
    ? contacts 
    : contacts.filter(c => c.role_type === filterRole)

  return (
    <>
      <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-neutral-50">Service & Accountability Roster</CardTitle>
              <CardDescription className="text-neutral-300">Your recovery network and commitments</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showDefaults && (
            <div className="bg-blue-900/30 border border-blue-700/40 p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-100">Get started with example contacts</p>
                  <p className="text-sm text-blue-200">We&apos;ve prepared common roles to help you build your network.</p>
                </div>
              </div>
              <Button size="sm" onClick={addAllDefaults} className="w-full">
                Add Example Contacts
              </Button>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={filterRole === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterRole('all')}
            >
              All
            </Button>
            {ROLE_TYPES.map((role) => (
              <Button
                key={role.value}
                size="sm"
                variant={filterRole === role.value ? 'default' : 'outline'}
                onClick={() => setFilterRole(role.value)}
              >
                {role.label}
              </Button>
            ))}
          </div>

          {filteredContacts.length === 0 && !showDefaults && (
            <p className="text-sm text-neutral-300 text-center py-8">
              No contacts yet. Add your first contact to build your recovery network.
            </p>
          )}

          {filteredContacts.map((contact) => {
            const parsedContact = parseContact(contact.contact || '')
            return (
              <div
                key={contact.id}
                className={`border rounded-lg p-4 space-y-3 ${!contact.active ? 'opacity-50 bg-muted/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">{contact.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {ROLE_TYPES.find(r => r.value === contact.role_type)?.label}
                    </p>
                  </div>
                </div>

                {parsedContact && (
                  <div className="flex gap-2">
                    {parsedContact.type === 'phone' && (
                      <a
                        href={`tel:${parsedContact.value}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Phone className="h-4 w-4" />
                        {parsedContact.value}
                      </a>
                    )}
                    {parsedContact.type === 'email' && (
                      <a
                        href={`mailto:${parsedContact.value}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Mail className="h-4 w-4" />
                        {parsedContact.value}
                      </a>
                    )}
                  </div>
                )}

                {contact.schedule && (
                  <p className="text-sm">
                    <span className="font-medium">Schedule:</span> {contact.schedule}
                  </p>
                )}

                {contact.notes && (
                  <p className="text-sm text-muted-foreground">{contact.notes}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(contact)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(contact)}
                  >
                    {contact.active ? (
                      <>
                        <ToggleRight className="h-4 w-4 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4 mr-1" />
                        Inactive
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
            <DialogDescription>
              {editingContact ? 'Update contact information' : 'Add someone to your recovery network'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Role Type *</label>
              <select
                value={formData.role_type}
                onChange={(e) => setFormData({ ...formData, role_type: e.target.value })}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                {ROLE_TYPES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Contact Info</label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="phone: 555-1234 or email: name@example.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: &quot;phone: 555-1234&quot; or &quot;email: name@example.com&quot;
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Schedule</label>
              <Input
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., Daily at 8am, Weekly on Mondays"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or reminders..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveContact} className="flex-1" disabled={!formData.name || !formData.role_type}>
                {editingContact ? 'Update' : 'Add'} Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
