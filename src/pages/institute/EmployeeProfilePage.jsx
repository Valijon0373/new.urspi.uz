import React, { useState, useEffect } from 'react'
import { ChevronRight, Phone, Mail, User, Briefcase, GraduationCap, Clock, Download, FileText } from 'lucide-react'
import { Link, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import menImg from '../../assets/men.jpg'
import { teachersAPI, employeesAPI, facultyStaffAPI, departmentsAPI, getFileUrl, resolvePersonPosition, getPositionName, localizedField, positionsAPI } from '../../api'

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

        const isTeacherCategory = targetType === 'teacher' || 
          Boolean(location.state?.teacher) || 
          Boolean(stateObj?.isTeacher) || 
          (targetType !== 'employee' && targetType !== 'faculty-staff' && targetType !== 'center' && targetType !== 'staff' && (hasData(landingTeacherObj) || hasData(teacherObj)));

        const isFacultyStaffCategory = !isTeacherCategory && (
          targetType === 'faculty-staff' || 
          Boolean(location.state?.staff) || 
          Boolean(stateObj?.isFacultyStaff) || 
          Boolean(stateObj?.isDean) || 
          (targetType !== 'employee' && targetType !== 'center' && (hasData(landingStaffObj) || hasData(staffObj)))
        );

        let cachedTeacherMeta = null;
        try {
          const map = JSON.parse(localStorage.getItem('urspi_teacher_positions_map') || '{}');
          cachedTeacherMeta = map[String(id)] || null;
        } catch (e) {}

        if (isTeacherCategory) {
          const teacherInAll = findInList(teacherList, id);
          const fullT = hasData(teacherObj) ? teacherObj : (hasData(teacherInAll) ? teacherInAll : null);
          const landingT = hasData(landingTeacherObj) ? landingTeacherObj : null;
          const passedT = (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) ? stateObj : null;

          data = {
            ...(landingT || {}),
            ...(passedT || {}),
            ...(fullT || {}),
            isTeacher: true
          };

          let candidatePosition =
            fullT?.positionTitleUz ||
            fullT?.positionTitle ||
            (typeof fullT?.position === 'string' ? fullT.position : (fullT?.position?.nameUz || fullT?.position?.name)) ||
            passedT?.positionTitleUz ||
            passedT?.positionTitle ||
            (typeof passedT?.position === 'string' ? passedT.position : (passedT?.position?.nameUz || passedT?.position?.name)) ||
            cachedTeacherMeta?.positionTitleUz ||
            cachedTeacherMeta?.position ||
            landingT?.positionTitleUz ||
            landingT?.positionTitle ||
            (typeof landingT?.position === 'string' ? landingT.position : (landingT?.position?.nameUz || landingT?.position?.name)) ||
            '';

          if (fullT?.position) data.position = fullT.position;
          else if (passedT?.position) data.position = passedT.position;
          else if (cachedTeacherMeta?.position) data.position = cachedTeacherMeta.position;

          if (fullT?.departmentName || fullT?.department?.name) data.departmentName = fullT.departmentName || fullT.department?.name;
          else if (passedT?.departmentName || passedT?.department) data.departmentName = passedT.departmentName || passedT.department;
          else if (cachedTeacherMeta?.department) data.departmentName = cachedTeacherMeta.department;

          if (passedT?.isDepartmentHead || fullT?.isDepartmentHead || cachedTeacherMeta?.isDepartmentHead) {
            data.isDepartmentHead = true;
          }

          // If still no specific position, check department assignment via public landing
          const isPosGeneric = !candidatePosition || candidatePosition.toLowerCase() === 'xodim';
          if (isPosGeneric) {
            try {
              const depRes = await departmentsAPI.getLanding(0, 50, lang);
              const depts = extractArray(depRes);
              const checks = depts.map(async (dept) => {
                try {
                  const res = await teachersAPI.getLandingByDepartment(dept.id, 0, 50, lang);
                  const list = extractArray(res);
                  const foundIdx = list.findIndex(t => String(t.id) === String(id));
                  if (foundIdx !== -1) {
                    return { dept, isFirst: foundIdx === 0, found: list[foundIdx] };
                  }
                } catch (e) {}
                return null;
              });
              const results = await Promise.all(checks);
              const match = results.find(Boolean);
              if (match) {
                if (!data.departmentName) data.departmentName = match.dept.name;
                if (match.isFirst) {
                  data.isDepartmentHead = true;
                  candidatePosition = lang === 'ru' ? 'Заведующий кафедрой' : lang === 'en' ? 'Head of Department' : 'Kafedra mudiri';
                  data.positionTitleUz = "Kafedra mudiri";
                } else if (!candidatePosition) {
                  candidatePosition = lang === 'ru' ? 'Преподаватель' : lang === 'en' ? 'Teacher' : "O'qituvchi";
                }
              }
            } catch (e) {}
          }

          const posId = data.positionId || fullT?.positionId || fullT?.position?.id || passedT?.positionId || cachedTeacherMeta?.positionId;
          if (posId) {
            const matchedPos = positions.find(p => String(p.id) === String(posId));
            if (matchedPos) {
              candidatePosition = getPositionName(matchedPos, lang, candidatePosition || "O'qituvchi");
              data.position = matchedPos;
            }
          }

          if (candidatePosition && typeof candidatePosition === 'string' && candidatePosition.trim()) {
            data.positionTitleUz = candidatePosition;
            data.position = candidatePosition;
          }
        } else if (isFacultyStaffCategory) {
          const staffInAll = findInList(staffList, id);
          const fullS = hasData(staffObj) ? staffObj : (hasData(staffInAll) ? staffInAll : null);
          const landingS = hasData(landingStaffObj) ? landingStaffObj : null;
          const passedS = (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) ? stateObj : null;

          data = {
            ...(landingS || {}),
            ...(passedS || {}),
            ...(fullS || {}),
            isFacultyStaff: true
          };
        } else {
          // Employee / Center staff
          const empInAll = findInList(empList, id);
          const fullE = hasData(empObj) ? empObj : (hasData(empInAll) ? empInAll : null);
          const landingE = hasData(empLandingObj) ? empLandingObj : null;
          const passedE = (stateObj && (String(stateObj.id) === String(id) || !stateObj.id)) ? stateObj : null;

          data = {
            ...(landingE || {}),
            ...(passedE || {}),
            ...(fullE || {}),
          };
        }

        if (!data && stateObj) {
          data = stateObj;
        }

        if (data && (!data.position || typeof data.position !== 'object')) {
          const posId = data.positionId || data.position?.id;
          const posObj = positions.find(p => String(p.id) === String(posId));
          if (posObj) data = { ...data, position: posObj };
        }

        if (data) {
          const rawImg = data.photoLink || data.photo || data.image || data.img || (typeof data.photo === 'object' ? data.photo?.link || data.photo?.url || data.photo?.path : '');
          
          const teacherFallback = lang === 'ru' ? 'Преподаватель' : lang === 'en' ? 'Teacher' : "O'qituvchi";
          const fallbackPos = isTeacherCategory
            ? teacherFallback
            : (isFacultyStaffCategory
                ? (lang === 'ru' ? 'Сотрудник факультета' : lang === 'en' ? 'Faculty Staff' : "Fakultet xodimi")
                : (lang === 'ru' ? 'Сотрудник' : lang === 'en' ? 'Employee' : "Xodim"));

          let rawPos = data.positionTitleUz || data.positionTitle || data.positionName || data.position;
          if (typeof rawPos === 'object' && rawPos) {
            rawPos = getPositionName(rawPos, lang, '');
          }

          let resolvedPos = (typeof rawPos === 'string' && rawPos.trim() && rawPos.toLowerCase() !== 'xodim')
            ? getPositionName(rawPos, lang, rawPos)
            : resolvePersonPosition(data, lang, fallbackPos);

          if (isTeacherCategory && (!resolvedPos || resolvedPos === 'Xodim' || resolvedPos === 'Сотрудник' || resolvedPos === 'Employee')) {
            resolvedPos = teacherFallback;
          }

          // Cache resolved position for future visits
          if (isTeacherCategory && (data.id || id)) {
            try {
              const map = JSON.parse(localStorage.getItem('urspi_teacher_positions_map') || '{}');
              map[String(data.id || id)] = {
                id: data.id || id,
                position: resolvedPos,
                positionTitleUz: data.positionTitleUz || resolvedPos,
                department: data.departmentName || '',
                isDepartmentHead: !!data.isDepartmentHead
              };
              localStorage.setItem('urspi_teacher_positions_map', JSON.stringify(map));
            } catch (e) {}
          }

          const degreeVal = data.academicDegree
            ? (typeof data.academicDegree === 'string' ? data.academicDegree : localizedField(data.academicDegree, 'name', lang, data.academicDegree?.nameUz || ''))
            : (data.degree || '');

          const defaultBio = isTeacherCategory
            ? (data.departmentName 
                ? `Urganch davlat pedagogika instituti ${data.departmentName} ${data.isDepartmentHead ? "mudiri" : "o'qituvchisi"}.`
                : (lang === 'ru' ? 'Преподаватель Ургенчского государственного педагогического института.' : lang === 'en' ? 'Teacher at Urgench State Pedagogical Institute.' : "Urganch davlat pedagogika instituti o'qituvchisi."))
            : (lang === 'ru' ? 'Сотрудник Ургенчского государственного педагогического института.' : lang === 'en' ? 'Employee of Urgench State Pedagogical Institute.' : "Urganch davlat pedagogika instituti xodimi.");

          const bioText = (data.bio && data.bio !== "Urganch davlat pedagogika instituti xodimi.")
            ? data.bio
            : (data.description && data.description !== "Urganch davlat pedagogika instituti xodimi." ? data.description : defaultBio);

          if (isMounted) {
            setEmployeeData({
              id: data.id || id,
              name: localizedField(data, 'fullName', lang, data.fullName || data.fullNameUz || data.name || (isTeacherCategory ? "O'qituvchi" : "Xodim")),
              position: resolvedPos,
              degree: degreeVal,
              phone: data.phoneNumber || data.phone || "",
              email: data.email || "info@urspi.uz",
              bio: bioText,
              officeHours: data.officeHours || data.receptionTime || data.receptionHours || "Dushanba - Juma: 09:00 - 17:00",
              img: getFileUrl(rawImg) || (typeof data.img === 'string' && data.img.length > 0 ? data.img : menImg),
              hasScience: !!(degreeVal || data.academicDegree || data.position || isTeacherCategory),
              cvLink: data.cvLink || data.cv || null
            });
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
                <div className="flex flex-wrap items-center gap-4">
                  {employeeData.cvLink && (
                    <a
                      href={getFileUrl(employeeData.cvLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0c1f4a] hover:bg-[#122b66] text-white font-semibold transition-all duration-300 w-full sm:w-auto shadow-sm"
                    >
                      <Download size={18} />
                      Rezyumeni yuklab olish (CV)
                    </a>
                  )}

                  {employeeData.hasScience && (
                    <button 
                      onClick={() => setShowIlmiyFaoliyat(!showIlmiyFaoliyat)}
                      className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-[#0c1f4a] font-semibold transition-colors duration-300 w-full sm:w-auto ${
                        showIlmiyFaoliyat ? 'bg-[#0c1f4a] text-white' : 'text-[#0c1f4a] hover:bg-[#0c1f4a] hover:text-white'
                      }`}
                    >
                      <GraduationCap size={20} />
                      Ilmiy Faoliyat
                    </button>
                  )}
                </div>
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
