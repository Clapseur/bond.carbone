'use client';

import * as React from 'react';
import { Star } from 'lucide-react';

import { IconButton } from './animate-ui/buttons/icon';

export const IconButtonDemo = () => {
  const [active, setActive] = React.useState(false);

  return (
    <IconButton 
      icon={Star} 
      active={active} 
      onClick={() => setActive(!active)} 
    />
  );
};