'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Edit2, Trash2, Eye, FileText, Calendar, User, Tag, Folder, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { RichTextEditor as MarkdownEditor } from '@/components/ui/markdown-editor'
import { FileUpload } from '@/components/ui/file-upload'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
}

interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
  categories: Category[]
  tags: Tag[]
}

const STATUS_LABELS = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado'
}

const STATUS_COLORS = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800'
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('posts')
  
  // Post modal states
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false)
  const [isViewPostModalOpen, setIsViewPostModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  
  // Category modal states
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  
  // Tag modal states
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false)
  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

  const [postFormData, setPostFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    categoryIds: [] as string[],
    tagIds: [] as string[]
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6'
  })

  const [tagFormData, setTagFormData] = useState({
    name: '',
    slug: '',
    color: '#10B981'
  })

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchTags()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/blog/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/blog/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const resetPostForm = () => {
    setPostFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image: '',
      status: 'DRAFT',
      categoryIds: [],
      tagIds: []
    })
    setImageFile(null)
    setImagePreview(null)
    setSelectedPost(null)
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3B82F6'
    })
    setSelectedCategory(null)
  }

  const resetTagForm = () => {
    setTagFormData({
      name: '',
      slug: '',
      color: '#10B981'
    })
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleCreatePost = async () => {
    try {
      let imageUrl = postFormData.image
      
      // Upload da imagem se houver
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postFormData, image: imageUrl })
      })

      if (response.ok) {
        await fetchPosts()
        setIsCreatePostModalOpen(false)
        resetPostForm()
        alert('Post criado com sucesso!')
      } else {
        alert('Erro ao criar post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Erro ao criar post')
    }
  }

  const handleCreateCategory = async () => {
    try {
      const response = await fetch('/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryFormData)
      })

      if (response.ok) {
        await fetchCategories()
        setIsCreateCategoryModalOpen(false)
        resetCategoryForm()
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleCreateTag = async () => {
    try {
      const response = await fetch('/api/admin/blog/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagFormData)
      })

      if (response.ok) {
        await fetchTags()
        setIsCreateTagModalOpen(false)
        resetTagForm()
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const handlePostStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post status:', error)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const openEditPostModal = (post: BlogPost) => {
    setSelectedPost(post)
    setPostFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      image: post.image || '',
      status: post.status,
      categoryIds: post.categories.map(c => c.id),
      tagIds: post.tags.map(t => t.id)
    })
    setImagePreview(post.image || null)
    setIsEditPostModalOpen(true)
  }

  const handleEditPost = async () => {
    if (!selectedPost) return

    try {
      let imageUrl = postFormData.image
      
      // Upload da imagem se houver
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const response = await fetch(`/api/admin/blog/posts/${selectedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postFormData, image: imageUrl })
      })

      if (response.ok) {
        await fetchPosts()
        setIsEditPostModalOpen(false)
        resetPostForm()
        alert('Post atualizado com sucesso!')
      } else {
        alert('Erro ao atualizar post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Erro ao atualizar post')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      const response = await fetch(`/api/admin/blog/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCategories()
        alert('Categoria excluída com sucesso!')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao excluir categoria')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erro ao excluir categoria')
    }
  }

  const openEditCategoryModal = (category: Category) => {
    setSelectedCategory(category)
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color
    })
    setIsEditCategoryModalOpen(true)
  }

  const handleEditCategory = async () => {
    if (!selectedCategory) return

    try {
      const response = await fetch(`/api/admin/blog/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryFormData)
      })

      if (response.ok) {
        await fetchCategories()
        setIsEditCategoryModalOpen(false)
        resetCategoryForm()
        alert('Categoria atualizada com sucesso!')
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar categoria')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Erro ao atualizar categoria')
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return

    try {
      const response = await fetch(`/api/admin/blog/tags/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTags()
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  // Funções de manipulação de imagem
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Falha no upload')
      }
      
      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setPostFormData({ ...postFormData, image: '' })
  }

  const openViewPostModal = (post: BlogPost) => {
    setSelectedPost(post)
    setIsViewPostModalOpen(true)
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Gerencie posts, categorias e tags do blog
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Posts do Blog</h2>
              <p className="text-muted-foreground">Gerencie os artigos do blog</p>
            </div>
            <Dialog open={isCreatePostModalOpen} onOpenChange={setIsCreatePostModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetPostForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Post</DialogTitle>
                  <DialogDescription>
                    Adicione um novo post ao blog
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={postFormData.title}
                        onChange={(e) => {
                          const title = e.target.value
                          setPostFormData({ 
                            ...postFormData, 
                            title,
                            slug: postFormData.slug || generateSlug(title)
                          })
                        }}
                        placeholder="Título do post"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={postFormData.slug}
                        onChange={(e) => setPostFormData({ ...postFormData, slug: e.target.value })}
                        placeholder="slug-do-post"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={postFormData.excerpt}
                      onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                      placeholder="Resumo do post (opcional)"
                      rows={2}
                    />
                  </div>
                  <MarkdownEditor
                    label="Conteúdo"
                    value={postFormData.content}
                    onChange={(value) => setPostFormData({ ...postFormData, content: value })}
                    placeholder="Escreva o conteúdo do post aqui..."
                    id="content"
                  />
                  <FileUpload
                    label="Imagem de Capa"
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                    preview={imagePreview}
                    loading={isUploading}
                    onFileSelect={(file) => {
                      const event = { target: { files: [file] } } as any;
                      handleFileChange(event);
                    }}
                    onRemove={removeImage}
                    className="mb-4"
                  />
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={postFormData.status} onValueChange={(value: any) => setPostFormData({ ...postFormData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreatePostModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleCreatePost}>
                    Criar Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Modal de Edição de Post */}
          <Dialog open={isEditPostModalOpen} onOpenChange={setIsEditPostModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Post</DialogTitle>
                <DialogDescription>
                  Edite as informações do post
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Título</Label>
                    <Input
                      id="edit-title"
                      value={postFormData.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setPostFormData({ 
                          ...postFormData, 
                          title,
                          slug: postFormData.slug === generateSlug(selectedPost?.title || '') ? generateSlug(title) : postFormData.slug
                        })
                      }}
                      placeholder="Título do post"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-slug">Slug</Label>
                    <Input
                      id="edit-slug"
                      value={postFormData.slug}
                      onChange={(e) => setPostFormData({ ...postFormData, slug: e.target.value })}
                      placeholder="slug-do-post"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-excerpt">Resumo</Label>
                  <Textarea
                    id="edit-excerpt"
                    value={postFormData.excerpt}
                    onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                    placeholder="Resumo do post (opcional)"
                    rows={2}
                  />
                  </div>
                  <MarkdownEditor
                    label="Conteúdo"
                    value={postFormData.content}
                    onChange={(value) => setPostFormData({ ...postFormData, content: value })}
                    placeholder="Escreva o conteúdo do post aqui..."
                    id="edit-content"
                  />                  <FileUpload
                    label="Imagem de Destaque"
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                    preview={imagePreview}
                    loading={isUploading}
                    onFileSelect={(file) => {
                      const event = { target: { files: [file] } } as any;
                      handleFileChange(event);
                    }}
                    onRemove={removeImage}
                    className="mb-4"
                    helperText={imageFile ? 'Nova imagem selecionada' : imagePreview ? 'Imagem atual' : undefined}
                  />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categorias</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!postFormData.categoryIds.includes(value)) {
                          setPostFormData({
                            ...postFormData,
                            categoryIds: [...postFormData.categoryIds, value]
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Adicionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter(cat => !postFormData.categoryIds.includes(cat.id))
                          .map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {postFormData.categoryIds.map(categoryId => {
                        const category = categories.find(c => c.id === categoryId)
                        return category ? (
                          <Badge
                            key={category.id}
                            style={{ backgroundColor: category.color }}
                            className="text-white"
                          >
                            {category.name}
                            <button
                              onClick={() => setPostFormData({
                                ...postFormData,
                                categoryIds: postFormData.categoryIds.filter(id => id !== categoryId)
                              })}
                              className="ml-1 text-white hover:text-gray-200"
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!postFormData.tagIds.includes(value)) {
                          setPostFormData({
                            ...postFormData,
                            tagIds: [...postFormData.tagIds, value]
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Adicionar tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags
                          .filter(tag => !postFormData.tagIds.includes(tag.id))
                          .map(tag => (
                          <SelectItem key={tag.id} value={tag.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                              {tag.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {postFormData.tagIds.map(tagId => {
                        const tag = tags.find(t => t.id === tagId)
                        return tag ? (
                          <Badge
                            key={tag.id}
                            style={{ backgroundColor: tag.color }}
                            className="text-white"
                          >
                            {tag.name}
                            <button
                              onClick={() => setPostFormData({
                                ...postFormData,
                                tagIds: postFormData.tagIds.filter(id => id !== tagId)
                              })}
                              className="ml-1 text-white hover:text-gray-200"
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={postFormData.status}
                    onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => 
                      setPostFormData({ ...postFormData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <Badge className={STATUS_COLORS[key as keyof typeof STATUS_COLORS]}>
                            {label}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditPostModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleEditPost}>
                  Atualizar Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Filtre os posts por termo ou status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título, conteúdo ou autor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Posts</CardTitle>
              <CardDescription>
                {filteredPosts.length} post(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Carregando posts...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[35%]">Título</TableHead>
                      <TableHead className="w-[15%]">Autor</TableHead>
                      <TableHead className="w-[20%]">Data</TableHead>
                      <TableHead className="w-[15%]">Status</TableHead>
                      <TableHead className="w-[15%]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {post.title}
                            </div>
                            {post.excerpt && (
                              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {post.excerpt}
                              </div>
                            )}
                            <div className="flex gap-1 mt-1">
                              {post.categories.map((category) => (
                                <Badge key={category.id} style={{ backgroundColor: category.color }} className="text-white text-xs">
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {post.author.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm">
                                {format(new Date(post.createdAt), 'PPP', { locale: ptBR })}
                              </div>
                              {post.publishedAt && (
                                <div className="text-xs text-muted-foreground">
                                  Pub: {format(new Date(post.publishedAt), 'PPP', { locale: ptBR })}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={post.status}
                            onValueChange={(value) => handlePostStatusChange(post.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  <Badge className={STATUS_COLORS[key as keyof typeof STATUS_COLORS]}>
                                    {label}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewPostModal(post)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditPostModal(post)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Categorias</h2>
              <p className="text-muted-foreground">Organize os posts em categorias</p>
            </div>
            <Dialog open={isCreateCategoryModalOpen} onOpenChange={setIsCreateCategoryModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetCategoryForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Categoria</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova categoria para organizar posts
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="cat-name">Nome</Label>
                    <Input
                      id="cat-name"
                      value={categoryFormData.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setCategoryFormData({ 
                          ...categoryFormData, 
                          name,
                          slug: categoryFormData.slug || generateSlug(name)
                        })
                      }}
                      placeholder="Nome da categoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat-slug">Slug</Label>
                    <Input
                      id="cat-slug"
                      value={categoryFormData.slug}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                      placeholder="slug-da-categoria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat-description">Descrição</Label>
                    <Textarea
                      id="cat-description"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      placeholder="Descrição da categoria (opcional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat-color">Cor</Label>
                    <Input
                      id="cat-color"
                      type="color"
                      value={categoryFormData.color}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateCategoryModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleCreateCategory}>
                    Criar Categoria
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Modal de Edição de Categoria */}
          <Dialog open={isEditCategoryModalOpen} onOpenChange={setIsEditCategoryModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Categoria</DialogTitle>
                <DialogDescription>
                  Edite as informações da categoria
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="edit-cat-name">Nome</Label>
                  <Input
                    id="edit-cat-name"
                    value={categoryFormData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setCategoryFormData({ 
                        ...categoryFormData, 
                        name,
                        slug: categoryFormData.slug === generateSlug(selectedCategory?.name || '') ? generateSlug(name) : categoryFormData.slug
                      })
                    }}
                    placeholder="Nome da categoria"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cat-slug">Slug</Label>
                  <Input
                    id="edit-cat-slug"
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                    placeholder="slug-da-categoria"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cat-description">Descrição</Label>
                  <Textarea
                    id="edit-cat-description"
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    placeholder="Descrição da categoria (opcional)"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cat-color">Cor</Label>
                  <Input
                    id="edit-cat-color"
                    type="color"
                    value={categoryFormData.color}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditCategoryModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleEditCategory}>
                  Atualizar Categoria
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5" style={{ color: category.color }} />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditCategoryModal(category)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {category.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Tags</h2>
              <p className="text-muted-foreground">Adicione tags aos posts para melhor organização</p>
            </div>
            <Dialog open={isCreateTagModalOpen} onOpenChange={setIsCreateTagModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetTagForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Tag</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova tag para classificar posts
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="tag-name">Nome</Label>
                    <Input
                      id="tag-name"
                      value={tagFormData.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setTagFormData({ 
                          ...tagFormData, 
                          name,
                          slug: tagFormData.slug || generateSlug(name)
                        })
                      }}
                      placeholder="Nome da tag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-slug">Slug</Label>
                    <Input
                      id="tag-slug"
                      value={tagFormData.slug}
                      onChange={(e) => setTagFormData({ ...tagFormData, slug: e.target.value })}
                      placeholder="slug-da-tag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-color">Cor</Label>
                    <Input
                      id="tag-color"
                      type="color"
                      value={tagFormData.color}
                      onChange={(e) => setTagFormData({ ...tagFormData, color: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateTagModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleCreateTag}>
                    Criar Tag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2 group">
                <Badge 
                  style={{ backgroundColor: tag.color }} 
                  className="text-white px-3 py-1 text-sm"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteTag(tag.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Post Modal */}
      <Dialog open={isViewPostModalOpen} onOpenChange={setIsViewPostModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Post</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                <p className="text-muted-foreground">
                  Por {selectedPost.author.name} • {format(new Date(selectedPost.createdAt), 'PPP', { locale: ptBR })}
                </p>
                <div className="flex gap-2 mt-2">
                  {selectedPost.categories.map((category) => (
                    <Badge key={category.id} style={{ backgroundColor: category.color }} className="text-white">
                      {category.name}
                    </Badge>
                  ))}
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedPost.image && (
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-48 object-cover rounded-lg" />
              )}
              {selectedPost.excerpt && (
                <p className="text-lg text-muted-foreground italic">{selectedPost.excerpt}</p>
              )}
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{selectedPost.content}</pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewPostModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}