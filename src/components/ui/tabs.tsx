import React, { createContext, useState, useContext } from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContext = createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({ value: undefined, onValueChange: undefined })

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className, ...props }) => {
  const [internalValue, setInternalValue] = useState(value || "")
  
  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }
  
  return (
    <TabsContext.Provider value={{ value: value || internalValue, onValueChange: handleValueChange }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: currentValue, onValueChange } = useContext(TabsContext)
    const isActive = currentValue === value
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive ? "bg-background text-foreground shadow" : "",
          className
        )}
        onClick={() => onValueChange?.(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: currentValue } = useContext(TabsContext)
    
    if (currentValue !== value) return null
    
    return (
      <div
        ref={ref}
        className={cn("mt-2 focus-visible:outline-none", className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }