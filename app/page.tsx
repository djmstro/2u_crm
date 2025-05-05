import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { redirect } from 'next/navigation';

export default function Home() {
  // Just redirect to the registration page for now
  redirect('/login');
  return null;
}
