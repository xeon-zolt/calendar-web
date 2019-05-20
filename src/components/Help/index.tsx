import * as React from 'react'
import * as blockstack from 'blockstack'
import FAQs from '../FAQ'
import QuestionsWeb from './QuestionsWeb'
import QuestionsDevs from './QuestionsDevs'

interface IProps {
	user?: blockstack.Profile
}

const Help: React.FC<IProps> = (props: IProps) => (
	<>
		<QuestionsWeb />
		<FAQs />
		<QuestionsDevs />
	</>
)

export default Help
