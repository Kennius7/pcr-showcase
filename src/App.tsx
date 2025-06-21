import { Toaster } from "sonner"
import PropertyBulletin from "./components/PropertyBulletin"

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton={true} />
      <PropertyBulletin />
    </>
  )
}

export default App
