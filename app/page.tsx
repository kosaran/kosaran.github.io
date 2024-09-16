'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, LogOut, Menu, X, Home, Activity, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

//define image type
interface ImageData {
  src: string;
  name: string;
  format: string;
  size: string;
}

export default function ImageUploader() {
  const [image, setImage] = useState<ImageData | null>(null)
  const [error, setError] = useState<string>('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          setImage({
            src: e.target.result,
            name: file.name,
            format: file.type.split('/')[1],
            size: (file.size / (1024 * 1024)).toFixed(2)
          })
        }
      }
      reader.readAsDataURL(file)
      setError('')
    } else {
      setError('File format not supported. Please upload an image file.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} })

  const resetUpload = () => {
    setImage(null)
    setError('')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
<motion.nav 
      className="bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-2xl text-gray-900">PARADOS</span>
          </div>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/analytics">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <Activity className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/settings">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/logout">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="md:hidden flex items-center">
            <motion.button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button variant="ghost" className="w-full text-left">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" className="w-full text-left">
                <Activity className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="ghost" className="w-full text-left">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full text-left">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>

      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Parados Image Uploader</CardTitle>
          </CardHeader>
          <CardContent>
            <div {...getRootProps()}>
              <motion.div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                            ${isDragActive ? 'border-primary' : 'border-gray-300'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input {...getInputProps()} />
                <AnimatePresence mode="wait">
                  {image ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.img 
                        src={image.src} 
                        alt={image.name} 
                        className="max-w-full h-auto mb-4 rounded"
                        layoutId="uploadedImage"
                      />
                      <p><strong>Name:</strong> {image.name}</p>
                      <p><strong>Format:</strong> {image.format}</p>
                      <p><strong>Size:</strong> {image.size} MB</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">Drag and drop an image here, or click to select a file</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {image && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button 
                    onClick={resetUpload} 
                    className="mt-4 w-full"
                    variant="outline"
                  >
                    Reset
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}