'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import usePresence from '@convex-dev/presence/react';
import FacePile from "@convex-dev/presence/facepile";

interface presenceProps {
  roomId: Id<'posts'>;
  userId: string;
}

const PostPresence = ({ roomId, userId }: presenceProps) => {
  const presenceState = usePresence(api.presence, roomId, userId);

  if(!presenceState || presenceState.length === 0){
    return null;
  }

  return <div className='flex items-center gap-2'>
    <p className='text-sm tracking-wide text-muted-foreground'>Viewers</p>
    <div className='text-black'>
      <FacePile presenceState={presenceState ?? []} />
    </div>
  </div>;
};

export default PostPresence;
