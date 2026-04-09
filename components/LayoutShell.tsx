'use client';

import ConsoleGreeting from '@/components/ConsoleGreeting';
import GlobalEffects from '@/components/GlobalEffects';
import AmbientBlobs from '@/components/AmbientBlobs';
import HeartCursorTrail from '@/components/HeartCursorTrail';
import SecretCode from '@/components/SecretCode';
import ScrollJourney from '@/components/ScrollJourney';
import VinylPlayer from '@/components/VinylPlayer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FinalPuzzleModal from '@/components/FinalPuzzleModal';
import RouteGuard from '@/components/RouteGuard';
import GateKeeper from '@/components/GateKeeper';
import EndingStage from '@/components/EndingStage';
import { useGame } from '@/lib/game-context';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { isEndingSequence, setIsEndingSequence, hasSeenEnding, setHasSeenEnding } = useGame();

  if (isEndingSequence) {
    return (
      <EndingStage
        onComplete={() => {
          setIsEndingSequence(false);
          setHasSeenEnding(true);
        }}
      />
    );
  }

  return (
    <>
      <ConsoleGreeting />
      <GlobalEffects />
      <AmbientBlobs />
      <HeartCursorTrail />
      <SecretCode />
      <ScrollJourney />
      <VinylPlayer />
      <Navbar />
      <GateKeeper>
        <RouteGuard>
          <main className="flex-1 relative z-10">{children}</main>
        </RouteGuard>
      </GateKeeper>
      <Footer />
      <FinalPuzzleModal />
    </>
  );
}
