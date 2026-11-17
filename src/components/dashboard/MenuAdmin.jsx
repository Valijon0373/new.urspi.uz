import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Eye, X, Check, Search, FileText,
  Layers, FolderTree, BookOpen, ExternalLink, Calendar,
  AlertCircle, RefreshCw, ChevronRight, FileCheck, Image as ImageIcon,
  Download, RotateCcw, Filter, Globe
} from 'lucide-react';
import {
  menuAdminAPI,
  getFileUrl,
  getStoredMenus,
  saveStoredMenu,
  deleteStoredMenu,
  getStoredCategories,
  saveStoredCategory,
  deleteStoredCategory,
  getStoredSubCategories,
  saveStoredSubCategory,
  deleteStoredSubCategory,
  getStoredInfos,
  saveStoredInfo,
  deleteStoredInfo,
  getStoredMaterials,
  saveStoredMaterial,
  deleteStoredMaterial,
  onMenuHierarchyChange,
  storeMenuFile,
  resetMenuHierarchyToDefault
} from '../../api';

// Helper for generating URL slugs
const slugify = (text = '') => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['‘’ʼ`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const parseTableColumns = (raw) => {
  if (Array.isArray(raw) && raw.length >= 3) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [
          parsed[0] || '№',
          parsed[1] || 'Sahifa nomi',
          parsed[2] || "Ko'rish"
        ];
      }
    } catch (e) {
      // ignore
    }
  }
  return ['№', 'Sahifa nomi', "Ko'rish"];
};

export default function MenuAdmin() {
  const [activeTab, setActiveTab] = useState('menus'); // 'menus' | 'categories' | 'subcategories' | 'infos' | 'materials'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [formLang, setFormLang] = useState('uz'); // 'uz' | 'ru' | 'en'

  // Master data lists synchronized with menuStorage
  const [allMenus, setAllMenus] = useState(() => getStoredMenus());
  const [allCategories, setAllCategories] = useState(() => getStoredCategories());
  const [allSubCategories, setAllSubCategories] = useState(() => getStoredSubCategories());
  const [allInfos, setAllInfos] = useState(() => getStoredInfos());
  const [allMaterials, setAllMaterials] = useState(() => getStoredMaterials());

  // Filters & search
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [selectedInfoId, setSelectedInfoId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Form States
  const [menuForm, setMenuForm] = useState({
    nameUz: '',
    nameRu: '',
    nameEn: '',
    slug: '',
    linkPath: '',
    sortOrder: 1
  });

  const [categoryForm, setCategoryForm] = useState({
    menuId: '',
    nameUz: '',
    nameRu: '',
    nameEn: '',
    slug: '',
    linkPath: '',
    sortOrder: 1
  });

  const [subCategoryForm, setSubCategoryForm] = useState({
    categoryId: '',
    nameUz: '',
    nameRu: '',
    nameEn: '',
    slug: '',
    contentType: 'TABLE',
    col0: '№',
    col1: 'Sahifa nomi',
    col2: "Ko'rish",
    linkPath: '',
    linkTargetType: 'INTERNAL',
    sortOrder: 1
  });

  const [infoForm, setInfoForm] = useState({
    subCategoryId: '',
    titleUz: '',
    titleRu: '',
    titleEn: '',
    contentUz: '',
    contentRu: '',
    contentEn: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    sortOrder: 1
  });
  const [infoPhotoFile, setInfoPhotoFile] = useState(null);
  const [infoPhotoPreview, setInfoPhotoPreview] = useState(null);
  const [infoDocFile, setInfoDocFile] = useState(null);
  const [infoFileLink, setInfoFileLink] = useState(null);
  const [infoFileName, setInfoFileName] = useState('');

  const [materialForm, setMaterialForm] = useState({
    infoId: '',
    year: new Date().getFullYear(),
    title: '',
    externalFileLink: ''
  });
  const [materialDocFile, setMaterialDocFile] = useState(null);
  const [materialCoverFile, setMaterialCoverFile] = useState(null);
  const [materialCoverPreview, setMaterialCoverPreview] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4500);
  };

  const syncFromStorage = () => {
    setAllMenus(getStoredMenus());
    setAllCategories(getStoredCategories());
    setAllSubCategories(getStoredSubCategories());
    setAllInfos(getStoredInfos());
    setAllMaterials(getStoredMaterials());
  };

  useEffect(() => {
    syncFromStorage();
    const unsub = onMenuHierarchyChange(() => {
      syncFromStorage();
    });
    return () => unsub();
  }, []);

  // Cascading filter options
  const filterCategoryOptions = useMemo(() => {
    if (!selectedMenuId) return allCategories;
    return allCategories.filter(c => String(c.menuId) === String(selectedMenuId));
  }, [allCategories, selectedMenuId]);

  const filterSubCategoryOptions = useMemo(() => {
    let list = allSubCategories;
    if (selectedMenuId) {
      list = list.filter(s => String(s.menuId) === String(selectedMenuId));
    }
    if (selectedCategoryId) {
      list = list.filter(s => String(s.categoryId) === String(selectedCategoryId));
    }
    return list;
  }, [allSubCategories, selectedMenuId, selectedCategoryId]);

  const filterInfoOptions = useMemo(() => {
    let list = allInfos;
    if (selectedMenuId) {
      list = list.filter(i => String(i.menuId) === String(selectedMenuId));
    }
    if (selectedCategoryId) {
      list = list.filter(i => String(i.categoryId) === String(selectedCategoryId));
    }
    if (selectedSubCategoryId) {
      list = list.filter(i => String(i.subCategoryId) === String(selectedSubCategoryId));
    }
    return list;
  }, [allInfos, selectedMenuId, selectedCategoryId, selectedSubCategoryId]);

  // Filtered table rows per tab
  const filteredMenus = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allMenus.filter(m => {
      if (selectedMenuId && String(m.id) !== String(selectedMenuId)) return false;
      if (!q) return true;
      return (
        (m.name || '').toLowerCase().includes(q) ||
        (m.slug || '').toLowerCase().includes(q) ||
        (m.linkPath || '').toLowerCase().includes(q)
      );
    });
  }, [allMenus, selectedMenuId, searchQuery]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return filterCategoryOptions.filter(c => {
      if (selectedCategoryId && String(c.id) !== String(selectedCategoryId)) return false;
      if (!q) return true;
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.menuName || '').toLowerCase().includes(q) ||
        (c.slug || '').toLowerCase().includes(q) ||
        (c.linkPath || '').toLowerCase().includes(q)
      );
    });
  }, [filterCategoryOptions, selectedCategoryId, searchQuery]);

  const filteredSubCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return filterSubCategoryOptions.filter(s => {
      if (selectedSubCategoryId && String(s.id) !== String(selectedSubCategoryId)) return false;
      if (!q) return true;
      return (
        (s.name || '').toLowerCase().includes(q) ||
        (s.categoryName || '').toLowerCase().includes(q) ||
        (s.menuName || '').toLowerCase().includes(q) ||
        (s.slug || '').toLowerCase().includes(q)
      );
    });
  }, [filterSubCategoryOptions, selectedSubCategoryId, searchQuery]);

  const filteredInfos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return filterInfoOptions.filter(i => {
      if (selectedInfoId && String(i.id) !== String(selectedInfoId)) return false;
      if (!q) return true;
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.content || '').toLowerCase().includes(q) ||
        (i.subCategoryName || '').toLowerCase().includes(q) ||
        (i.fileName || '').toLowerCase().includes(q)
      );
    });
  }, [filterInfoOptions, selectedInfoId, searchQuery]);

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = allMaterials;
    if (selectedInfoId) {
      list = list.filter(m => String(m.infoId) === String(selectedInfoId));
    } else if (selectedSubCategoryId) {
      list = list.filter(m => String(m.subCategoryId) === String(selectedSubCategoryId));
    }
    return list.filter(m => {
      if (!q) return true;
      return (
        (m.title || '').toLowerCase().includes(q) ||
        (m.infoTitle || '').toLowerCase().includes(q) ||
        String(m.year || '').includes(q)
      );
    });
  }, [allMaterials, selectedInfoId, selectedSubCategoryId, searchQuery]);

  const hasActiveFilters = Boolean(
    selectedMenuId || selectedCategoryId || selectedSubCategoryId || selectedInfoId || searchQuery.trim()
  );

  const clearAllFilters = () => {
    setSelectedMenuId('');
    setSelectedCategoryId('');
    setSelectedSubCategoryId('');
    setSelectedInfoId('');
    setSearchQuery('');
  };

  // Drill-down helpers
  const drillToCategories = (menuId) => {
    setSelectedMenuId(String(menuId));
    setSelectedCategoryId('');
    setSelectedSubCategoryId('');
    setSelectedInfoId('');
    setActiveTab('categories');
  };

  const drillToSubCategories = (cat) => {
    setSelectedMenuId(String(cat.menuId || ''));
    setSelectedCategoryId(String(cat.id));
    setSelectedSubCategoryId('');
    setSelectedInfoId('');
    setActiveTab('subcategories');
  };

  const drillToInfos = (sub) => {
    setSelectedMenuId(String(sub.menuId || ''));
    setSelectedCategoryId(String(sub.categoryId || ''));
    setSelectedSubCategoryId(String(sub.id));
    setSelectedInfoId('');
    setActiveTab('infos');
  };

  const drillToMaterials = (info) => {
    setSelectedMenuId(String(info.menuId || ''));
    setSelectedCategoryId(String(info.categoryId || ''));
    setSelectedSubCategoryId(String(info.subCategoryId || ''));
    setSelectedInfoId(String(info.id));
    setActiveTab('materials');
  };

  // Open Create Modal (optionally pre-filling parent ID)
  const handleOpenCreate = (targetTab = activeTab, prefillParentId = null) => {
    if (targetTab !== activeTab) setActiveTab(targetTab);
    setEditMode(false);
    setSelectedItem(null);
    setFormLang('uz');

    if (targetTab === 'menus') {
      setMenuForm({
        nameUz: '',
        nameRu: '',
        nameEn: '',
        slug: '',
        linkPath: '',
        sortOrder: (allMenus.length || 0) + 1
      });
    } else if (targetTab === 'categories') {
      const mId = prefillParentId || selectedMenuId || (allMenus[0]?.id ? String(allMenus[0].id) : '');
      const catsForMenu = allCategories.filter(c => String(c.menuId) === String(mId));
      setCategoryForm({
        menuId: String(mId),
        nameUz: '',
        nameRu: '',
        nameEn: '',
        slug: '',
        linkPath: '',
        sortOrder: (catsForMenu.length || 0) + 1
      });
    } else if (targetTab === 'subcategories') {
      const cId = prefillParentId || selectedCategoryId || (filterCategoryOptions[0]?.id || allCategories[0]?.id || '');
      const subsForCat = allSubCategories.filter(s => String(s.categoryId) === String(cId));
      setSubCategoryForm({
        categoryId: String(cId),
        nameUz: '',
        nameRu: '',
        nameEn: '',
        slug: '',
        contentType: 'TABLE',
        col0: '№',
        col1: 'Sahifa nomi',
        col2: "Ko'rish",
        linkPath: '',
        linkTargetType: 'INTERNAL',
        sortOrder: (subsForCat.length || 0) + 1
      });
    } else if (targetTab === 'infos') {
      const sId = prefillParentId || selectedSubCategoryId || (filterSubCategoryOptions[0]?.id || allSubCategories[0]?.id || '');
      const infosForSub = allInfos.filter(i => String(i.subCategoryId) === String(sId));
      setInfoForm({
        subCategoryId: String(sId),
        titleUz: '',
        titleRu: '',
        titleEn: '',
        contentUz: '',
        contentRu: '',
        contentEn: '',
        publishedAt: new Date().toISOString().slice(0, 10),
        sortOrder: (infosForSub.length || 0) + 1
      });
      setInfoPhotoFile(null);
      setInfoPhotoPreview(null);
      setInfoDocFile(null);
      setInfoFileLink(null);
      setInfoFileName('');
    } else if (targetTab === 'materials') {
      const iId = prefillParentId || selectedInfoId || (filterInfoOptions[0]?.id || allInfos[0]?.id || '');
      setMaterialForm({
        infoId: String(iId),
        year: new Date().getFullYear(),
        title: '',
        externalFileLink: ''
      });
      setMaterialDocFile(null);
      setMaterialCoverFile(null);
      setMaterialCoverPreview(null);
    }
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormLang('uz');

    if (activeTab === 'menus') {
      setMenuForm({
        nameUz: item.nameUz || item.name || '',
        nameRu: item.nameRu || '',
        nameEn: item.nameEn || '',
        slug: item.slug || '',
        linkPath: item.linkPath && item.linkPath !== '#' ? item.linkPath : '',
        sortOrder: item.sortOrder || 1
      });
    } else if (activeTab === 'categories') {
      setCategoryForm({
        menuId: String(item.menuId || selectedMenuId || (allMenus[0]?.id || '')),
        nameUz: item.nameUz || item.name || '',
        nameRu: item.nameRu || '',
        nameEn: item.nameEn || '',
        slug: item.slug || '',
        linkPath: item.linkPath && item.linkPath !== '#' ? item.linkPath : '',
        sortOrder: item.sortOrder || 1
      });
    } else if (activeTab === 'subcategories') {
      const cols = parseTableColumns(item.tableColumns);
      setSubCategoryForm({
        categoryId: String(item.categoryId || selectedCategoryId || (allCategories[0]?.id || '')),
        nameUz: item.nameUz || item.name || '',
        nameRu: item.nameRu || '',
        nameEn: item.nameEn || '',
        slug: item.slug || '',
        contentType: item.contentType || 'TABLE',
        col0: cols[0] || '№',
        col1: cols[1] || 'Sahifa nomi',
        col2: cols[2] || "Ko'rish",
        linkPath: item.linkPath || '',
        linkTargetType: item.linkTargetType || 'INTERNAL',
        sortOrder: item.sortOrder || 1
      });
    } else if (activeTab === 'infos') {
      const rawDate = item.publishedAt || item.createdAt || '';
      setInfoForm({
        subCategoryId: String(item.subCategoryId || selectedSubCategoryId || (allSubCategories[0]?.id || '')),
        titleUz: item.titleUz || item.title || '',
        titleRu: item.titleRu || '',
        titleEn: item.titleEn || '',
        contentUz: item.contentUz || item.content || '',
        contentRu: item.contentRu || '',
        contentEn: item.contentEn || '',
        publishedAt: rawDate ? String(rawDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
        sortOrder: item.sortOrder ?? 1
      });
      setInfoPhotoFile(null);
      setInfoPhotoPreview(item.photoLink ? getFileUrl(item.photoLink) : null);
      setInfoDocFile(null);
      setInfoFileLink(item.fileLink || null);
      setInfoFileName(item.fileName || '');
    } else if (activeTab === 'materials') {
      setMaterialForm({
        infoId: String(item.infoId || selectedInfoId || (allInfos[0]?.id || '')),
        year: item.year || new Date().getFullYear(),
        title: item.title || '',
        externalFileLink: item.fileLink && !String(item.fileLink).startsWith('idb://') ? item.fileLink : ''
      });
      setMaterialDocFile(null);
      setMaterialCoverFile(null);
      setMaterialCoverPreview(item.coverLink ? getFileUrl(item.coverLink) : null);
    }
    setIsModalOpen(true);
  };

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'menus') {
        const nameUz = menuForm.nameUz.trim();
        if (!nameUz) throw new Error('Menyu nomini kiriting!');

        const payload = {
          name: nameUz,
          nameUz,
          nameRu: menuForm.nameRu.trim(),
          nameEn: menuForm.nameEn.trim(),
          slug: menuForm.slug?.trim() || slugify(nameUz),
          linkPath: menuForm.linkPath?.trim() || null,
          sortOrder: Number(menuForm.sortOrder) || 1
        };

        saveStoredMenu({
          id: editMode && selectedItem ? selectedItem.id : undefined,
          ...payload
        });

        try {
          if (editMode && selectedItem) {
            await menuAdminAPI.updateMenu(selectedItem.id, payload);
          } else {
            await menuAdminAPI.createMenu(payload);
          }
        } catch (apiErr) {
          // Local storage is already updated
        }

        syncFromStorage();
        showNotification(editMode ? 'Menyu muvaffaqiyatli tahrirlandi!' : 'Yangi menyu yaratildi!');
      } else if (activeTab === 'categories') {
        if (!categoryForm.menuId) {
          throw new Error('Iltimos, biriktirilgan menyuni tanlang!');
        }
        const nameUz = categoryForm.nameUz.trim();
        if (!nameUz) throw new Error('Kategoriya nomini kiriting!');

        const payload = {
          menuId: Number(categoryForm.menuId),
          name: nameUz,
          nameUz,
          nameRu: categoryForm.nameRu.trim(),
          nameEn: categoryForm.nameEn.trim(),
          slug: categoryForm.slug?.trim() || slugify(nameUz),
          linkPath: categoryForm.linkPath?.trim() || null,
          sortOrder: Number(categoryForm.sortOrder) || 1
        };

        saveStoredCategory({
          id: editMode && selectedItem ? selectedItem.id : undefined,
          ...payload
        });

        try {
          if (editMode && selectedItem) {
            await menuAdminAPI.updateCategory(selectedItem.id, payload);
          } else {
            await menuAdminAPI.createCategory(payload);
          }
        } catch (apiErr) {
          // Local storage is already updated
        }

        syncFromStorage();
        showNotification(editMode ? 'Kategoriya tahrirlandi!' : 'Yangi kategoriya yaratildi!');
      } else if (activeTab === 'subcategories') {
        if (!subCategoryForm.categoryId) {
          throw new Error('Iltimos, biriktirilgan kategoriyani tanlang!');
        }
        const nameUz = subCategoryForm.nameUz.trim();
        if (!nameUz) throw new Error('Quyi kategoriya nomini kiriting!');

        const tableColumnsJson = JSON.stringify([
          subCategoryForm.col0?.trim() || '№',
          subCategoryForm.col1?.trim() || 'Sahifa nomi',
          subCategoryForm.col2?.trim() || "Ko'rish"
        ]);

        const payload = {
          categoryId: Number(subCategoryForm.categoryId),
          name: nameUz,
          nameUz,
          nameRu: subCategoryForm.nameRu.trim(),
          nameEn: subCategoryForm.nameEn.trim(),
          slug: subCategoryForm.slug?.trim() || slugify(nameUz),
          contentType: subCategoryForm.contentType,
          tableColumns: tableColumnsJson,
          linkPath: subCategoryForm.contentType === 'LINK' ? (subCategoryForm.linkPath?.trim() || null) : null,
          linkTargetType: subCategoryForm.contentType === 'LINK' ? (subCategoryForm.linkTargetType || 'INTERNAL') : null,
          sortOrder: Number(subCategoryForm.sortOrder) || 1
        };

        saveStoredSubCategory({
          id: editMode && selectedItem ? selectedItem.id : undefined,
          ...payload
        });

        try {
          if (editMode && selectedItem) {
            await menuAdminAPI.updateSubCategory(selectedItem.id, payload);
          } else {
            await menuAdminAPI.createSubCategory(payload);
          }
        } catch (apiErr) {
          // Local storage is already updated
        }

        syncFromStorage();
        showNotification(editMode ? 'Quyi bo\'lim tahrirlandi!' : 'Yangi quyi bo\'lim yaratildi!');
      } else if (activeTab === 'infos') {
        if (!infoForm.subCategoryId) {
          throw new Error('Iltimos, biriktirilgan quyi bo\'limni (SubCategory) tanlang!');
        }
        const titleUz = infoForm.titleUz.trim();
        if (!titleUz) throw new Error('Yozuv sarlavhasini kiriting!');

        let storedPhotoKey = editMode && selectedItem ? selectedItem.photoLink : null;
        if (!infoPhotoPreview) {
          storedPhotoKey = null;
        }
        if (infoPhotoFile) {
          storedPhotoKey = await storeMenuFile(infoPhotoFile);
        }

        let storedDocKey = infoFileLink;
        let currentFileName = infoFileName;
        if (infoDocFile) {
          currentFileName = infoDocFile.name;
          storedDocKey = await storeMenuFile(infoDocFile);
        }

        saveStoredInfo({
          id: editMode && selectedItem ? selectedItem.id : undefined,
          subCategoryId: Number(infoForm.subCategoryId),
          title: titleUz,
          titleUz,
          titleRu: infoForm.titleRu.trim(),
          titleEn: infoForm.titleEn.trim(),
          content: infoForm.contentUz,
          contentUz: infoForm.contentUz,
          contentRu: infoForm.contentRu,
          contentEn: infoForm.contentEn,
          publishedAt: infoForm.publishedAt ? `${infoForm.publishedAt}T10:00:00` : new Date().toISOString(),
          sortOrder: Number(infoForm.sortOrder) || 0,
          photoLink: storedPhotoKey,
          fileLink: storedDocKey,
          fileName: currentFileName
        });

        try {
          const formData = new FormData();
          formData.append('subCategoryId', String(infoForm.subCategoryId));
          formData.append('title', titleUz);
          formData.append('titleUz', titleUz);
          if (infoForm.titleRu) formData.append('titleRu', infoForm.titleRu);
          if (infoForm.titleEn) formData.append('titleEn', infoForm.titleEn);
          if (infoForm.contentUz) {
            formData.append('content', infoForm.contentUz);
            formData.append('contentUz', infoForm.contentUz);
          }
          formData.append('sortOrder', String(infoForm.sortOrder || 0));
          if (infoPhotoFile) formData.append('photo', infoPhotoFile);
          if (infoDocFile) {
            formData.append('file', infoDocFile);
            formData.append('fileName', infoDocFile.name);
          }

          if (editMode && selectedItem) {
            await menuAdminAPI.updateInfo(selectedItem.id, formData);
          } else {
            await menuAdminAPI.createInfo(formData);
          }
        } catch (apiErr) {
          // Local storage is already updated
        }

        syncFromStorage();
        showNotification(editMode ? 'Yozuv (Info) tahrirlandi!' : 'Yangi yozuv (Info) yaratildi!');
      } else if (activeTab === 'materials') {
        if (!materialForm.infoId) {
          throw new Error('Iltimos, biriktirilgan yozuvni (Info) tanlang!');
        }

        let storedFileKey = editMode && selectedItem ? selectedItem.fileLink : null;
        let storedFileName = editMode && selectedItem ? selectedItem.fileName : '';
        if (materialForm.externalFileLink?.trim()) {
          storedFileKey = materialForm.externalFileLink.trim();
        }
        if (materialDocFile) {
          storedFileName = materialDocFile.name;
          storedFileKey = await storeMenuFile(materialDocFile);
        }

        let storedCoverKey = editMode && selectedItem ? selectedItem.coverLink : null;
        if (!materialCoverPreview) {
          storedCoverKey = null;
        }
        if (materialCoverFile) {
          storedCoverKey = await storeMenuFile(materialCoverFile);
        }

        saveStoredMaterial({
          id: editMode && selectedItem ? selectedItem.id : undefined,
          infoId: Number(materialForm.infoId),
          year: Number(materialForm.year) || new Date().getFullYear(),
          title: materialForm.title.trim(),
          fileLink: storedFileKey,
          fileName: storedFileName,
          coverLink: storedCoverKey
        });

        try {
          const formData = new FormData();
          formData.append('infoId', String(materialForm.infoId));
          formData.append('year', String(materialForm.year));
          formData.append('title', materialForm.title.trim());
          if (materialDocFile) formData.append('file', materialDocFile);
          if (materialCoverFile) formData.append('cover', materialCoverFile);

          if (editMode && selectedItem) {
            await menuAdminAPI.updateMaterial(selectedItem.id, formData);
          } else {
            await menuAdminAPI.createMaterial(formData);
          }
        } catch (apiErr) {
          // Local storage is already updated
        }

        syncFromStorage();
        showNotification(editMode ? 'Material tahrirlandi!' : 'Yangi material yuklandi!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showNotification(err.message || 'Xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      if (activeTab === 'menus') {
        deleteStoredMenu(selectedItem.id);
        try { await menuAdminAPI.deleteMenu(selectedItem.id); } catch (e) {}
      } else if (activeTab === 'categories') {
        deleteStoredCategory(selectedItem.id);
        try { await menuAdminAPI.deleteCategory(selectedItem.id); } catch (e) {}
      } else if (activeTab === 'subcategories') {
        deleteStoredSubCategory(selectedItem.id);
        try { await menuAdminAPI.deleteSubCategory(selectedItem.id); } catch (e) {}
      } else if (activeTab === 'infos') {
        deleteStoredInfo(selectedItem.id);
        try { await menuAdminAPI.deleteInfo(selectedItem.id); } catch (e) {}
      } else if (activeTab === 'materials') {
        deleteStoredMaterial(selectedItem.id);
        try { await menuAdminAPI.deleteMaterial(selectedItem.id); } catch (e) {}
      }
      syncFromStorage();
      showNotification("Muvaffaqiyatli o'chirildi! Sayt menyusi yangilandi.");
      setDeleteModalOpen(false);
    } catch (err) {
      showNotification(err.message || "O'chirishda xatolik", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefault = () => {
    resetMenuHierarchyToDefault();
    clearAllFilters();
    syncFromStorage();
    setResetModalOpen(false);
    showNotification("Menyular va sahifalar boshlang'ich holatga tiklandi!");
  };

  return (
    <div className="space-y-6">
      {/* ── Notification Alert ── */}
      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-[80] max-w-md p-4 rounded-xl text-sm font-semibold flex items-center gap-3 shadow-xl transition-all ${
            notification.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <Check className="w-5 h-5 shrink-0" />
          )}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: 'success' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">
            Menyular va Sahifalar boshqaruvi
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Menyu → Kategoriya → Quyi bo'lim → Sahifa/Yozuv → Yillik materiallar ierarxiyasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            title="Standart menyularni tiklash"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Standart holat</span>
          </button>
          <button
            type="button"
            onClick={() => {
              syncFromStorage();
              showNotification("Ma'lumotlar yangilandi");
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Yangilash</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenCreate(activeTab)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Qo'shish</span>
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation with Live Counts ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
        {[
          { key: 'menus', label: '1. Menyular', count: allMenus.length, icon: FolderTree },
          { key: 'categories', label: '2. Kategoriyalar', count: allCategories.length, icon: Layers },
          { key: 'subcategories', label: "3. Quyi bo'limlar (Sub)", count: allSubCategories.length, icon: BookOpen },
          { key: 'infos', label: '4. Yozuvlar (Info)', count: allInfos.length, icon: FileText },
          { key: 'materials', label: '5. Materiallar (Yil/PDF)', count: allMaterials.length, icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0eb99c] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search & Hierarchy Filter Bar ── */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom, sarlavha yoki slug bo'yicha qidirish..."
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Barcha filtrlarni tozalash</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-medium pt-1">
          {/* Menu selector */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">1. Menyu bo'yicha filtr:</label>
            <select
              value={selectedMenuId}
              onChange={(e) => {
                setSelectedMenuId(e.target.value);
                setSelectedCategoryId('');
                setSelectedSubCategoryId('');
                setSelectedInfoId('');
              }}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
            >
              <option value="">Barcha menyular ({allMenus.length})</option>
              {allMenus.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.categoriesCount} ta kat.)
                </option>
              ))}
            </select>
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">2. Kategoriya bo'yicha filtr:</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubCategoryId('');
                setSelectedInfoId('');
              }}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
            >
              <option value="">Barcha kategoriyalar ({filterCategoryOptions.length})</option>
              {filterCategoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.menuName} → {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* SubCategory selector */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">3. Quyi bo'lim (SubCategory):</label>
            <select
              value={selectedSubCategoryId}
              onChange={(e) => {
                setSelectedSubCategoryId(e.target.value);
                setSelectedInfoId('');
              }}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
            >
              <option value="">Barcha quyi bo'limlar ({filterSubCategoryOptions.length})</option>
              {filterSubCategoryOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.contentType})
                </option>
              ))}
            </select>
          </div>

          {/* Info selector */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">4. Yozuv / Jurnal (Info):</label>
            <select
              value={selectedInfoId}
              onChange={(e) => setSelectedInfoId(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
            >
              <option value="">Barcha yozuvlar ({filterInfoOptions.length})</option>
              {filterInfoOptions.map((info) => (
                <option key={info.id} value={info.id}>
                  {info.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Table Content per Active Tab ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
                <th className="py-3.5 px-4 w-14 text-center">ID</th>
                <th className="py-3.5 px-4">Nomi / Sarlavha</th>
                <th className="py-3.5 px-4">Biriktirilgan joyi / Turi</th>
                <th className="py-3.5 px-4">Ichki bo'limlar / Fayllar</th>
                <th className="py-3.5 px-4 text-center w-20">Tartib</th>
                <th className="py-3.5 px-4 text-center w-36">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
              {/* TAB 1: MENUS */}
              {activeTab === 'menus' && (
                filteredMenus.length > 0 ? (
                  filteredMenus.map((m) => {
                    const previewUrl = m.linkPath || `/menu/${m.id}`;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">{m.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-100 block">{m.name}</span>
                          {(m.nameRu || m.nameEn) && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {[m.nameRu && `RU: ${m.nameRu}`, m.nameEn && `EN: ${m.nameEn}`].filter(Boolean).join(' | ')}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="font-mono text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                            {m.slug}
                          </span>
                          {m.linkPath && (
                            <span className="block text-blue-600 dark:text-blue-400 font-mono text-[11px] mt-1">
                              Havola: {m.linkPath}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => drillToCategories(m.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-[#0eb99c] hover:bg-teal-100 text-xs font-bold transition cursor-pointer"
                            >
                              <span>{m.categoriesCount || 0} ta kategoriya</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenCreate('categories', m.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-[#0eb99c] hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                              title="Shu menyuga kategoriya qo'shish"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold">{m.sortOrder}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={previewUrl}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0eb99c] hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Sahifani ko'rish"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedItem(m); setDeleteModalOpen(true); }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Menyular topilmadi
                    </td>
                  </tr>
                )
              )}

              {/* TAB 2: CATEGORIES */}
              {activeTab === 'categories' && (
                filteredCategories.length > 0 ? (
                  filteredCategories.map((c) => {
                    const previewUrl = c.linkPath && c.linkPath !== '#' ? c.linkPath : `/category/${c.id}`;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">{c.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-100 block">{c.name}</span>
                          <span className="text-[11px] font-mono text-slate-400">{c.slug}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                            <FolderTree className="w-3.5 h-3.5 text-[#0eb99c]" />
                            {c.menuName || `Menyu #${c.menuId}`}
                          </span>
                          {c.linkPath && c.linkPath !== '#' && (
                            <span className="block text-blue-600 dark:text-blue-400 font-mono text-[11px] mt-1">
                              To'g'ridan-to'g'ri: {c.linkPath}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => drillToSubCategories(c)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
                            >
                              <span>{c.subCategoriesCount || 0} ta quyi bo'lim</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenCreate('subcategories', c.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                              title="Shu kategoriyaga quyi bo'lim qo'shish"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold">{c.sortOrder}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={previewUrl}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0eb99c] hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Sahifani ko'rish"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedItem(c); setDeleteModalOpen(true); }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Kategoriyalar topilmadi
                    </td>
                  </tr>
                )
              )}

              {/* TAB 3: SUBCATEGORIES */}
              {activeTab === 'subcategories' && (
                filteredSubCategories.length > 0 ? (
                  filteredSubCategories.map((s) => {
                    const previewUrl = s.contentType === 'LINK' && s.linkPath ? s.linkPath : `/subcategories/${s.id}`;
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">{s.id}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 dark:text-slate-100 block">{s.name}</span>
                          <Link
                            to={previewUrl}
                            target="_blank"
                            className="text-[11px] text-[#0eb99c] hover:underline inline-flex items-center gap-1 mt-0.5 font-semibold"
                          >
                            <span>Sahifani ochish</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <div className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                            {s.menuName} → <strong className="text-slate-700 dark:text-slate-200">{s.categoryName}</strong>
                          </div>
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                            {s.contentType === 'TABLE' ? 'TABLE (Jadval)' : s.contentType === 'FEED' ? 'FEED (Kartalar)' : 'LINK (Havola)'}
                          </span>
                          {s.linkPath && (
                            <span className="block text-slate-400 font-mono text-[11px] mt-1">{s.linkPath}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => drillToInfos(s)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300 hover:bg-violet-100 text-xs font-bold transition cursor-pointer"
                            >
                              <span>{s.infosCount || 0} ta yozuv (Info)</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenCreate('infos', s.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                              title="Shu quyi bo'limga yozuv (Info) qo'shish"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold">{s.sortOrder}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              to={previewUrl}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0eb99c] hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Sahifani ko'rish"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(s)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedItem(s); setDeleteModalOpen(true); }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Quyi bo'limlar (SubCategory) topilmadi
                    </td>
                  </tr>
                )
              )}

              {/* TAB 4: INFOS */}
              {activeTab === 'infos' && (
                filteredInfos.length > 0 ? (
                  filteredInfos.map((info) => (
                    <tr key={info.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">{info.id}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-100 block line-clamp-2">{info.title}</span>
                        {info.content && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 m-0">{info.content}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                          {info.subCategoryName || `Sub #${info.subCategoryId}`}
                        </span>
                        <div className="mt-1 space-y-1">
                          {info.photoLink && (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                              <ImageIcon className="w-3.5 h-3.5" /> Rasm biriktirilgan
                            </span>
                          )}
                          {info.fileLink && (
                            <a
                              href={getFileUrl(info.fileLink)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="truncate max-w-[160px]">{info.fileName || "Faylni ko'rish"}</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => drillToMaterials(info)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold transition cursor-pointer"
                          >
                            <span>{info.materialsCount || 0} ta material</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenCreate('materials', info.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            title="Shu yozuvga yillik material/PDF qo'shish"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">{info.sortOrder}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/infos/${info.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0eb99c] hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Batafsil sahifasini ko'rish"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(info)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSelectedItem(info); setDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Yozuvlar (Info) topilmadi
                    </td>
                  </tr>
                )
              )}

              {/* TAB 5: MATERIALS */}
              {activeTab === 'materials' && (
                filteredMaterials.length > 0 ? (
                  filteredMaterials.map((mat) => {
                    const resolvedFileUrl = mat.fileLink ? getFileUrl(mat.fileLink) : '';
                    return (
                      <tr key={mat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">{mat.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                          {mat.title}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                            {mat.infoTitle || `Info #${mat.infoId}`}
                          </span>
                          {mat.subCategoryName && (
                            <span className="text-[11px] text-slate-400">{mat.subCategoryName}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {resolvedFileUrl ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={resolvedFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 font-bold hover:underline"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ochish</span>
                              </a>
                              <a
                                href={resolvedFileUrl}
                                download={mat.fileName || `${mat.title}.pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold hover:underline"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Yuklash</span>
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-400">Fayl biriktirilmagan</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold font-mono text-xs">
                            {mat.year}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(mat)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSelectedItem(mat); setDeleteModalOpen(true); }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Materiallar topilmadi
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 shrink-0">
              <h3 className="font-bold text-slate-800 dark:text-white text-base m-0">
                {editMode ? 'Tahrirlash' : "Yangi qo'shish"}:{' '}
                <span className="text-[#0eb99c]">
                  {activeTab === 'menus' && 'Menyu'}
                  {activeTab === 'categories' && 'Kategoriya'}
                  {activeTab === 'subcategories' && "Quyi bo'lim (SubCategory)"}
                  {activeTab === 'infos' && 'Yozuv / Sahifa (Info)'}
                  {activeTab === 'materials' && 'Material (Yil / PDF)'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Language Tabs for Multilingual Forms */}
              {activeTab !== 'materials' && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                  {[
                    { code: 'uz', label: "O'zbek (Asosiy)" },
                    { code: 'ru', label: 'Русский' },
                    { code: 'en', label: 'English' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setFormLang(l.code)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                        formLang === l.code
                          ? 'bg-white dark:bg-slate-800 text-[#0eb99c] shadow-xs'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 1. MENUS FORM */}
              {activeTab === 'menus' && (
                <>
                  {formLang === 'uz' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Menyu nomi (O'zbekcha) *
                      </label>
                      <input
                        type="text"
                        required
                        value={menuForm.nameUz}
                        onChange={(e) => {
                          const nameUz = e.target.value;
                          setMenuForm((prev) => ({
                            ...prev,
                            nameUz,
                            slug: editMode
                              ? prev.slug
                              : prev.slug === slugify(prev.nameUz) || !prev.slug
                              ? slugify(nameUz)
                              : prev.slug
                          }));
                        }}
                        placeholder="Masalan: Xalqaro hamkorlik"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}
                  {formLang === 'ru' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Menyu nomi (Русский)
                      </label>
                      <input
                        type="text"
                        value={menuForm.nameRu}
                        onChange={(e) => setMenuForm({ ...menuForm, nameRu: e.target.value })}
                        placeholder="Международное сотрудничество"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}
                  {formLang === 'en' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Menyu nomi (English)
                      </label>
                      <input
                        type="text"
                        value={menuForm.nameEn}
                        onChange={(e) => setMenuForm({ ...menuForm, nameEn: e.target.value })}
                        placeholder="International Cooperation"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                      <input
                        type="text"
                        value={menuForm.slug}
                        onChange={(e) => setMenuForm({ ...menuForm, slug: e.target.value })}
                        placeholder="xalqaro-hamkorlik"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tartib raqami</label>
                      <input
                        type="number"
                        value={menuForm.sortOrder}
                        onChange={(e) => setMenuForm({ ...menuForm, sortOrder: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      To'g'ridan-to'g'ri sahifa havolasi (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={menuForm.linkPath}
                      onChange={(e) => setMenuForm({ ...menuForm, linkPath: e.target.value })}
                      placeholder="Masalan: /green-institute (agar ichki kategoriyalari bo'lmasa)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    />
                  </div>
                </>
              )}

              {/* 2. CATEGORIES FORM */}
              {activeTab === 'categories' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Biriktirilgan Menyu *
                    </label>
                    <select
                      required
                      value={categoryForm.menuId}
                      onChange={(e) => setCategoryForm({ ...categoryForm, menuId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    >
                      <option value="">Menyuni tanlang</option>
                      {allMenus.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {formLang === 'uz' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kategoriya nomi (O'zbekcha) *
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryForm.nameUz}
                        onChange={(e) => {
                          const nameUz = e.target.value;
                          setCategoryForm((prev) => ({
                            ...prev,
                            nameUz,
                            slug: editMode
                              ? prev.slug
                              : prev.slug === slugify(prev.nameUz) || !prev.slug
                              ? slugify(nameUz)
                              : prev.slug
                          }));
                        }}
                        placeholder="Masalan: Ilmiy va innovatsion faoliyat"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}
                  {formLang === 'ru' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kategoriya nomi (Русский)
                      </label>
                      <input
                        type="text"
                        value={categoryForm.nameRu}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nameRu: e.target.value })}
                        placeholder="Научная и инновационная деятельность"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}
                  {formLang === 'en' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kategoriya nomi (English)
                      </label>
                      <input
                        type="text"
                        value={categoryForm.nameEn}
                        onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                        placeholder="Scientific and Innovative Activity"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                      <input
                        type="text"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        placeholder="ilmiy-innovatsion"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tartib raqami</label>
                      <input
                        type="number"
                        value={categoryForm.sortOrder}
                        onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      To'g'ridan-to'g'ri havola (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={categoryForm.linkPath}
                      onChange={(e) => setCategoryForm({ ...categoryForm, linkPath: e.target.value })}
                      placeholder="Bo'sh qoldirilsa quyi bo'limlar ochiladi (masalan: /leadership)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    />
                  </div>
                </>
              )}

              {/* 3. SUBCATEGORIES FORM */}
              {activeTab === 'subcategories' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Biriktirilgan Kategoriya *
                    </label>
                    <select
                      required
                      value={subCategoryForm.categoryId}
                      onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    >
                      <option value="">Kategoriyani tanlang</option>
                      {allMenus.map((m) => {
                        const menuCats = allCategories.filter(c => String(c.menuId) === String(m.id));
                        if (menuCats.length === 0) return null;
                        return (
                          <optgroup key={m.id} label={m.name}>
                            {menuCats.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>

                  {formLang === 'uz' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Quyi bo'lim (SubCategory) nomi (O'zbekcha) *
                      </label>
                      <input
                        type="text"
                        required
                        value={subCategoryForm.nameUz}
                        onChange={(e) => {
                          const nameUz = e.target.value;
                          setSubCategoryForm((prev) => ({
                            ...prev,
                            nameUz,
                            slug: editMode
                              ? prev.slug
                              : prev.slug === slugify(prev.nameUz) || !prev.slug
                              ? slugify(nameUz)
                              : prev.slug
                          }));
                        }}
                        placeholder="Masalan: UrDPI ilmiy jurnallari"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}
                  {formLang === 'ru' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Quyi bo'lim nomi (Русский)
                      </label>
                      <input
                        type="text"
                        value={subCategoryForm.nameRu}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, nameRu: e.target.value })}
                        placeholder="Научные журналы УрГПИ"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}
                  {formLang === 'en' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Quyi bo'lim nomi (English)
                      </label>
                      <input
                        type="text"
                        value={subCategoryForm.nameEn}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, nameEn: e.target.value })}
                        placeholder="UrSPI Scientific Journals"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sahifa ko'rinishi (contentType) *
                    </label>
                    <select
                      value={subCategoryForm.contentType}
                      onChange={(e) => setSubCategoryForm({ ...subCategoryForm, contentType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    >
                      <option value="TABLE">TABLE — Jadval ro'yxati (Jurnallar, Hujjatlar, Ro'yxatlar)</option>
                      <option value="FEED">FEED — Yangilik va Maqola kartalari (Rasm + Tavsif)</option>
                      <option value="LINK">LINK — Boshqa sahifaga yo'naltirish</option>
                    </select>
                  </div>

                  {subCategoryForm.contentType === 'TABLE' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Jadval ustunlari nomlari
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={subCategoryForm.col0}
                          onChange={(e) => setSubCategoryForm({ ...subCategoryForm, col0: e.target.value })}
                          placeholder="№"
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:border-[#0eb99c]"
                        />
                        <input
                          type="text"
                          value={subCategoryForm.col1}
                          onChange={(e) => setSubCategoryForm({ ...subCategoryForm, col1: e.target.value })}
                          placeholder="Sahifa nomi"
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:border-[#0eb99c]"
                        />
                        <input
                          type="text"
                          value={subCategoryForm.col2}
                          onChange={(e) => setSubCategoryForm({ ...subCategoryForm, col2: e.target.value })}
                          placeholder="Ko'rish"
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                    </div>
                  )}

                  {subCategoryForm.contentType === 'LINK' && (
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Yo'naltirish havolasi (linkPath) *
                      </label>
                      <input
                        type="text"
                        required
                        value={subCategoryForm.linkPath}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, linkPath: e.target.value })}
                        placeholder="/regulatory-documents yoki https://..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
                      <input
                        type="text"
                        value={subCategoryForm.slug}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, slug: e.target.value })}
                        placeholder="urdpi-jurnallar"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tartib raqami</label>
                      <input
                        type="number"
                        value={subCategoryForm.sortOrder}
                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, sortOrder: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 4. INFOS FORM */}
              {activeTab === 'infos' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Biriktirilgan Quyi bo'lim (SubCategory) *
                    </label>
                    <select
                      required
                      value={infoForm.subCategoryId}
                      onChange={(e) => setInfoForm({ ...infoForm, subCategoryId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    >
                      <option value="">Quyi bo'limni tanlang</option>
                      {allCategories.map((c) => {
                        const catSubs = allSubCategories.filter(s => String(s.categoryId) === String(c.id));
                        if (catSubs.length === 0) return null;
                        return (
                          <optgroup key={c.id} label={`${c.menuName} → ${c.name}`}>
                            {catSubs.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.contentType})
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>

                  {formLang === 'uz' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Sarlavha (O'zbekcha) *
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.titleUz}
                          onChange={(e) => setInfoForm({ ...infoForm, titleUz: e.target.value })}
                          placeholder="Masalan: UrDPI Axborotnomasi"
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Tavsif / Matn (O'zbekcha)
                        </label>
                        <textarea
                          rows={3}
                          value={infoForm.contentUz}
                          onChange={(e) => setInfoForm({ ...infoForm, contentUz: e.target.value })}
                          placeholder="Jurnal, hujjat yoki sahifa haqida batafsil ma'lumot..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                    </>
                  )}

                  {formLang === 'ru' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Sarlavha (Русский)
                        </label>
                        <input
                          type="text"
                          value={infoForm.titleRu}
                          onChange={(e) => setInfoForm({ ...infoForm, titleRu: e.target.value })}
                          placeholder="Вестник УрГПИ"
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Tavsif / Matn (Русский)
                        </label>
                        <textarea
                          rows={3}
                          value={infoForm.contentRu}
                          onChange={(e) => setInfoForm({ ...infoForm, contentRu: e.target.value })}
                          placeholder="Описание..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                    </>
                  )}

                  {formLang === 'en' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Sarlavha (English)
                        </label>
                        <input
                          type="text"
                          value={infoForm.titleEn}
                          onChange={(e) => setInfoForm({ ...infoForm, titleEn: e.target.value })}
                          placeholder="UrSPI Bulletin"
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Tavsif / Matn (English)
                        </label>
                        <textarea
                          rows={3}
                          value={infoForm.contentEn}
                          onChange={(e) => setInfoForm({ ...infoForm, contentEn: e.target.value })}
                          placeholder="Description..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sana</label>
                      <input
                        type="date"
                        value={infoForm.publishedAt}
                        onChange={(e) => setInfoForm({ ...infoForm, publishedAt: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tartib raqami</label>
                      <input
                        type="number"
                        value={infoForm.sortOrder}
                        onChange={(e) => setInfoForm({ ...infoForm, sortOrder: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Rasm yuklash (ixtiyoriy)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setInfoPhotoFile(file || null);
                        if (file) setInfoPhotoPreview(URL.createObjectURL(file));
                      }}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {infoPhotoPreview && (
                      <div className="relative inline-block mt-2">
                        <img src={infoPhotoPreview} alt="Preview" className="w-24 h-20 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => {
                            setInfoPhotoFile(null);
                            setInfoPhotoPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Fayl / Hujjat biriktirish (PDF, Word, Excel, ZIP...)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setInfoDocFile(file || null);
                        if (file) {
                          setInfoFileName(file.name);
                          setInfoFileLink(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {(infoDocFile || infoFileLink) && (
                      <div className="flex items-center justify-between gap-2 mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                            {infoDocFile ? infoDocFile.name : (infoFileName || 'Biriktirilgan fayl')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {infoFileLink && (
                            <a
                              href={getFileUrl(infoFileLink)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Ko'rish
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setInfoDocFile(null);
                              setInfoFileLink(null);
                              setInfoFileName('');
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Faylni o'chirish"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 5. MATERIALS FORM */}
              {activeTab === 'materials' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Biriktirilgan Yozuv / Jurnal (Info) *
                    </label>
                    <select
                      required
                      value={materialForm.infoId}
                      onChange={(e) => setMaterialForm({ ...materialForm, infoId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    >
                      <option value="">Yozuv (Info) tanlang</option>
                      {allSubCategories.map((s) => {
                        const subInfos = allInfos.filter(i => String(i.subCategoryId) === String(s.id));
                        if (subInfos.length === 0) return null;
                        return (
                          <optgroup key={s.id} label={s.name}>
                            {subInfos.map((info) => (
                              <option key={info.id} value={info.id}>
                                {info.title}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nashr yili *</label>
                      <input
                        type="number"
                        required
                        value={materialForm.year}
                        onChange={(e) => setMaterialForm({ ...materialForm, year: e.target.value })}
                        placeholder="2026"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Soni / Sarlavhasi *
                      </label>
                      <input
                        type="text"
                        required
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                        placeholder="Masalan: 2026-yil 1-son"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hujjat fayli (PDF / Word / ZIP)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.zip,.rar"
                      onChange={(e) => setMaterialDocFile(e.target.files[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Yoki tashqi fayl havolasi (URL, ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={materialForm.externalFileLink}
                      onChange={(e) => setMaterialForm({ ...materialForm, externalFileLink: e.target.value })}
                      placeholder="https://... yoki /files/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-[#0eb99c]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Muqova rasmi (Cover, ixtiyoriy)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        setMaterialCoverFile(f || null);
                        if (f) setMaterialCoverPreview(URL.createObjectURL(f));
                      }}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {materialCoverPreview && (
                      <div className="relative inline-block mt-2">
                        <img src={materialCoverPreview} alt="Cover" className="w-20 h-24 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => {
                            setMaterialCoverFile(null);
                            setMaterialCoverPreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#0eb99c] hover:bg-[#0ca389] text-white font-semibold transition shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">
              Haqiqatan ham o'chirmoqchimisiz?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
              {selectedItem.name || selectedItem.title || `ID: ${selectedItem.id}`}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESET DEFAULT MODAL ── */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full text-center shadow-2xl">
            <RotateCcw className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">
              Standart menyularni tiklash
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Sayt menyulari, kategoriyalari va sahifalari boshlang'ich standart holatga qaytarilsinmi?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md transition cursor-pointer"
              >
                Ha, tiklash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
