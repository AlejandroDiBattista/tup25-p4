import { UserFormDialog } from "@/components/user-form-dialog"
import { GlowingEffect } from "@/components/ui/glowing-effect"

function App() {
  return (
    
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Mi Aplicación</h1>
    
      <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />  
      <div className="flex gap-4">
        <UserFormDialog />
      </div>
    </div>
  )
}

export default App