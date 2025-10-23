import Image from 'next/image'

export function BannerCieloBradesco() {
  return (
    <div className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 py-4 px-4 mb-6 rounded-lg shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-4 text-white">
          {/* Logo Cielo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold">cielo</span>
          </div>
          
          {/* Separador */}
          <div className="flex items-center gap-2">
            <div className="w-px h-6 bg-white/50"></div>
            <span className="text-lg font-bold">+</span>
            <div className="w-px h-6 bg-white/50"></div>
          </div>
          
          {/* Logo Bradesco */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold">bradesco</span>
          </div>
        </div>
      </div>
      
      {/* Texto de parceria */}
      <div className="text-center mt-2">
        <p className="text-white/90 text-sm font-medium">
          Parceria Estratégica
        </p>
      </div>
    </div>
  )
}
