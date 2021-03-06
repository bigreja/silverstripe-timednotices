<?php

namespace SheaDawson\TimedNotice;

use SheaDawson\TimedNotice\TimedNotice;
use SilverStripe\ORM\DataExtension;

/**
 * TimedNoticeExtension
 */
class TimedNoticePageExtension extends DataExtension
{
    /**
     * Gets any notices relevant to the present time, context and current users
     *
     * @return HTMLText
     */
    public function notices()
    {
        // render a list of notications for this
        return $this->owner
            ->customise(array('Notices' => TimedNotice::get_notices('Website')))
            ->renderWith('NoticesList');
    }
}
