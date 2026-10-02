import React, { useState, useEffect } from 'react'
import { ChevronRight, Phone, Mail, User, Briefcase, GraduationCap, Clock } from 'lucide-react'
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import menImg from '../../assets/men.jpg'
import { teachersAPI, employeesAPI, facultyStaffAPI, getFileUrl, resolvePersonPosition, localizedField, positionsAPI } from '../../api'

export default function EmployeeProfilePage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const targetType = searchParams.get('type')
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'uz'
  const [showIlmiyFaoliyat, setShowIlmiyFaoliyat] = useState(false)
  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const extractArray = (payload) => {
      if (!payload) return []
      if (Array.isArray(payload)) return payload
      if (Array.isArray(payload.content)) return payload.content
      if (Array.isArray(payload.data?.content)) return payload.data.content
      if (Array.isArray(payload.data)) return payload.data
      if (Array.isArray(payload.items)) return payload.items
      if (Array.isArray(payload.result)) return payload.result
      return []
    }

    const fetchEmployee = async () => {
      if (!id) return
      setLoading(true)

      let data = null
      const stateObj = location.state?.employee || location.state?.person || location.state?.teacher || location.state?.staff

      try {
        const [
          empRes,
          empLandingRes,
          empAllRes,
          teacherRes,
          landingTeacherRes,
          teacherAllRes,
          landingStaffRes,
          staffRes,
          staffAllRes,
          posRes
        ] = await Promise.allSettled([
          employeesAPI.getById(id),
          employeesAPI.getLandingById ? employeesAPI.getLandingById(id, lang) : Promise.resolve(null),
          employeesAPI.getAll(lang),
          teachersAPI.getById(id),
          teachersAPI.getLandingById(id, lang),
          teachersAPI.getAll(lang),
          facultyStaffAPI.getLandingById(id, lang),
          facultyStaffAPI.getById(id),
          facultyStaffAPI.getAll(lang),
          positionsAPI.getAll()
        ])

        const getObj = (res) => (res.status === 'fulfilled' && res.value) ? (res.value.data || res.value) : null
        const getList = (res) => res.status === 'fulfilled' ? extractArray(res.value) : []

        const empObj = getObj(empRes)
        const empLandingObj = getObj(empLandingRes)
        const empList = getList(empAllRes)

        const teacherObj = getObj(teacherRes)
        const landingTeacherObj = getObj(landingTeacherRes)
        const teacherList = getList(teacherAllRes)

        const staffObj = getObj(staffRes)
        const landingStaffObj = getObj(landingStaffRes)
        const staffList = getList(staffAllRes)

        const positions = getList(posRes)

        const hasData = (obj) => !!(obj && (obj.fullName || obj.fullNameUz || obj.name || obj.nameUz || obj.id))
        const findInList = (list, targetId) => list.find(item => String(item.id) === String(targetId))

        if (targetType === 'employee' || targetType === 'staff' || targetType === 'center') {
          if (hasData(empObj)) data = empObj
          else if (hasData(empLandingObj)) data = empLandingObj
          else {
            const foundInAll = findInList(empList, id)
            if (hasData(foundInAll)) data = foundInAll
            else if (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) data = stateObj
            else if (hasData(staffObj)) data = staffObj
            else if (hasData(landingStaffObj)) data = landingStaffObj
            else {
              const foundInStaff = findInList(staffList, id)
              if (hasData(foundInStaff)) data = foundInStaff
            }
          }
        } else if (targetType === 'faculty-staff') {
          if (hasData(landingStaffObj)) data = landingStaffObj
          else if (hasData(staffObj)) data = staffObj
          else {
            const foundInStaff = findInList(staffList, id)
            if (hasData(foundInStaff)) data = foundInStaff
            else if (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) data = stateObj
            else if (hasData(empObj)) data = empObj
            else if (hasData(empLandingObj)) data = empLandingObj
          }
        } else if (targetType === 'teacher') {
          if (hasData(teacherObj)) data = teacherObj
          else if (hasData(landingTeacherObj)) data = landingTeacherObj
          else {
            const foundInTeachers = findInList(teacherList, id)
            if (hasData(foundInTeachers)) data = foundInTeachers
            else if (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) data = stateObj
          }
        } else {
          if (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) {
            data = stateObj
          } else if (hasData(empObj) && (empObj.centerId || empObj.center || empObj.positionTitleUz || empObj.positionTitle)) {
            data = empObj
          } else if (hasData(teacherObj)) {
            data = teacherObj
          } else if (hasData(landingTeacherObj)) {
            data = landingTeacherObj
          } else if (hasData(empObj)) {
            data = empObj
          } else if (hasData(landingStaffObj)) {
            data = landingStaffObj
          } else if (hasData(staffObj)) {
            data = staffObj
          }
        }

        if (!data && stateObj) {
          data = stateObj
        }

        if (data && (!data.position || typeof data.position !== 'object')) {
          const posId = data.positionId || data.position?.id
          const posObj = positions.find(p => String(p.id) === String(posId))
          if (posObj) data = { ...data, position: posObj }
        }

        if (data) {
          const rawImg = data.photoLink || data.photo || data.image || data.img || (typeof data.photo === 'object' ? data.photo?.link || data.photo?.url || data.photo?.path : '')
          const rawPos = data.positionTitle || data.positionTitleUz || data.positionName || data.position
          const resolvedPos = (typeof rawPos === 'string' && rawPos.trim()) ? rawPos : resolvePersonPosition(data, lang, "Xodim")
          const degreeVal = data.academicDegree ? (typeof data.academicDegree === 'string' ? data.academicDegree : localizedField(data.academicDegree, 'name', lang, data.academicDegree?.nameUz || '')) : ''

          if (isMounted) {
            setEmployeeData({
              id: data.id || id,
              name: localizedField(data, 'fullName', lang, data.fullName || data.fullNameUz || data.name || "Xodim"),
              position: resolvedPos,
              degree: degreeVal,
              phone: data.phoneNumber || data.phone || "",
              email: data.email || "info@urspi.uz",
              bio: data.bio || data.description || "Urganch davlat pedagogika instituti xodimi.",
              officeHours: data.officeHours || data.receptionTime || data.receptionHours || "Dushanba - Juma: 09:00 - 17:00",
              img: getFileUrl(rawImg) || (typeof data.img === 'string' && data.img.length > 0 ? data.img : menImg),
              hasScience: !!(degreeVal || data.academicDegree || data.position || data.isTeacher || targetType === 'teacher')
            })
          }
        }
      } catch (err) {
        console.warn('Failed to load profile from API:', err.message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchEmployee()
    return () => { isMounted = false }
  }, [id, lang, targetType, location.state])

  if (loading) {
    return <main className="flex-1 bg-slate-50 py-16 text-center text-slate-500 font-medium">Yuklanmoqda...</main>;
  }

  if (!employeeData) {
    return <main className="flex-1 bg-slate-50 py-16 text-center text-slate-500 font-medium">Xodim topilmadi</main>;
  }

  const displayImg = employeeData.img || menImg;

  return (
    <div className="flex-grow bg-slate-50 flex flex-col min-h-[calc(100vh-200px)]">
      {/* Header Banner */}
      <div className="w-full bg-[#0c1f4a] py-6 md:py-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
          <nav className="flex text-sm text-white/80" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="hover:text-white transition-colors">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1 opacity-70" />
                  <span className="text-white/80 font-medium">{employeeData.position}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1 opacity-70" />
                  <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-xs">{employeeData.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-10 md:py-16 flex flex-col flex-grow">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row items-start p-6 md:p-10 gap-8 lg:gap-12 relative">
            
            {/* Left Image Section */}
            <div className="w-full md:w-[320px] shrink-0 mx-auto md:mx-0">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
                <img
                  src={displayImg}
                  alt={employeeData.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right Content Section */}
            <div className="flex-1 flex flex-col h-full w-full">
              
              <div className="mb-8 border-b border-slate-100 pb-6 text-center md:text-left">
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#0c1f4a] uppercase tracking-tight leading-tight mb-3">
                  {employeeData.name}
                </h1>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 mb-8">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Lavozim</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.position}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Elektron pochta</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Telefon raqami</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-[#0c1f4a] rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-[13px] text-slate-500 font-medium uppercase tracking-wider mb-1">Qabul vaqtlari</div>
                    <div className="text-slate-800 font-semibold text-[15px]">{employeeData.officeHours}</div>
                  </div>
                </div>

              </div>

              <div className="mt-auto flex flex-col gap-6">
                {/* Bio Section */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-[#0c1f4a] text-[16px] mb-3 flex items-center gap-2">
                    <User size={18} />
                    Qisqacha ma'lumot
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-[15px]">
                    {employeeData.bio}
                  </p>
                </div>

                {/* Action Buttons */}
                {employeeData.hasScience && (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowIlmiyFaoliyat(!showIlmiyFaoliyat)}
                      className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-[#0c1f4a] font-semibold transition-colors duration-300 w-full sm:w-auto ${
                        showIlmiyFaoliyat ? 'bg-[#0c1f4a] text-white' : 'text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white'
                      }`}
                    >
                      <GraduationCap size={20} />
                      Ilmiy Faoliyat
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Dropdown Content */}
          {showIlmiyFaoliyat && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mt-4 transition-all w-full animate-in fade-in slide-in-from-top-4 duration-300">
              <h4 className="font-bold text-[#0c1f4a] mb-5 text-[18px] border-b border-slate-100 pb-4">
                Ilmiy faoliyat yo'nalishlari
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  "Xalqaro jurnallarda nashr etilgan maqolalar",
                  "Respublika miqyosidagi ilmiy jurnallardagi nashrlar",
                  "O'quv qo'llanmalar va darsliklar",
                  "Ilmiy monografiyalar",
                  "Mualliflik guvohnomalari va patentlar"
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 border border-slate-200 rounded-xl px-5 py-4 text-[14px] sm:text-[15px] text-[#0c1f4a] font-semibold transition-all duration-300 hover:border-blue-400 hover:shadow-md cursor-pointer bg-white group"
                  >
                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0 transition-transform group-hover:translate-x-1" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
