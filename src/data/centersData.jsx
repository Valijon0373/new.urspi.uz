import React from 'react';
import {
  BookOpen, GraduationCap, Library, Users, Award, Heart, Sparkles, Star, Scale,
  Globe, Shield, Monitor, Calculator, FileText, Landmark, ShieldCheck,
  TrendingUp, UserCheck, Briefcase, Cpu, Building
} from 'lucide-react';

export const initialCenters = [];

export const renderCenterIcon = (iconName, className = "w-10 h-10 text-blue-500") => {
  switch (iconName) {
    case 'BookOpen': return <BookOpen className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Library': return <Library className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Scale': return <Scale className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Monitor': return <Monitor className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Landmark': return <Landmark className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    default: return <Building className={className} />;
  }
};

export const getAutoIcon = (title = '') => {
  const t = String(title).toLowerCase();
  if (t.includes('axborot') || t.includes('texnologiya') || t.includes('it') || t.includes('kompyuter') || t.includes('raqamli')) return 'Monitor';
  if (t.includes('kutubxona') || t.includes('arm')) return 'Library';
  if (t.includes('xalqaro')) return 'Globe';
  if (t.includes('yoshlar') || t.includes('ma\'naviyat') || t.includes('ma`naviyat')) return 'Sparkles';
  if (t.includes('magistratura')) return 'Award';
  if (t.includes('iqtidorli')) return 'Star';
  if (t.includes('huquq') || t.includes('yurist')) return 'Scale';
  if (t.includes('kasaba') || t.includes('himoya') || t.includes('nazorat') || t.includes('komplayens')) return 'ShieldCheck';
  if (t.includes('marketing')) return 'TrendingUp';
  if (t.includes('buxgalter') || t.includes('moliya') || t.includes('hisob')) return 'Calculator';
  if (t.includes('xotin') || t.includes('qizlar')) return 'Heart';
  if (t.includes('o\'quv') || t.includes('ta\'lim')) return 'BookOpen';
  if (t.includes('ilmiy') || t.includes('tadqiqot')) return 'GraduationCap';
  if (t.includes('registrator') || t.includes('devonxona')) return 'Briefcase';
  return 'Building';
};

export const getStoredCenters = () => {
  return initialCenters;
};

export const saveStoredCenters = (centers) => {
  // No-op to eliminate localStorage domain persistence
};

