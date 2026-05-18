
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AddonManager } from '@/lib/addons/addon-manager';
import { CorporateLandingPage } from '@/components/landing/landing-page';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }
  
  const isLandingActive = await AddonManager.isAddonEnabled('landing-page-webuilder');
  
  if (isLandingActive) {
    return <CorporateLandingPage />;
  } else {
    redirect('/login');
  }
}
