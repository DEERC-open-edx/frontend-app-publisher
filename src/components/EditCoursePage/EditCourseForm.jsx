import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Collapsible } from '@edx/paragon';

import ActionButton from '../../components/ActionButton';
import ButtonToolbar from '../../components/ButtonToolbar';
import CollapsibleCourseRunFields from './CollapsibleCourseRunFields';
import FieldLabel from '../FieldLabel';
import ImageUpload from '../../components/ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../../components/RichEditor';
import Pill from '../../components/Pill';
import { AUDIT_TRACK, VERIFIED_TRACK, PROFESSIONAL_TRACK } from '../../data/constants';


export class BaseEditCourseForm extends React.Component {
  getEnrollmentTrackOptions() {
    return [
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: PROFESSIONAL_TRACK.name, value: PROFESSIONAL_TRACK.key },
    ];
  }

  getCourseOptions() {
    const { courseOptions } = this.props;

    if (!courseOptions) {
      return [];
    }

    const { data } = courseOptions;

    if (!data || !data.actions) {
      return [];
    }

    return data.actions.PUT;
  }

  getCourseRunOptions() {
    const { courseRunOptions } = this.props;

    if (!courseRunOptions) {
      return [];
    }

    const { data } = courseRunOptions;

    if (!data || !data.actions) {
      return [];
    }

    return data.actions.POST;
  }

  parseOptions(inChoices) {
    return inChoices.map(choice =>
      ({ label: choice.display_name, value: choice.value }));
  }

  formatCourseTitle(title, courseStatuses) {
    // TODO: After we have a way of determining if the course has been edited, that should be
    // added into the list of statuses being passed into the Pill component.
    return (
      <React.Fragment>
        {`Course: ${title}`}
        <Pill statuses={courseStatuses} />
      </React.Fragment>
    );
  }

  render() {
    const {
      handleSubmit,
      number,
      entitlement,
      submitting,
      title,
      pristine,
      uuid,
      courseInReview,
      courseStatuses,
      id,
      isSubmittingForReview,
    } = this.props;
    const courseOptions = this.getCourseOptions();
    const courseRunOptions = this.getCourseRunOptions();
    const levelTypeOptions = courseOptions && this.parseOptions(courseOptions.level_type.choices);
    const subjectOptions = courseOptions && this.parseOptions(courseOptions.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.pacing_type.choices));
    const languageOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.content_language.choices));

    let submitState = 'default';
    if (submitting) {
      submitState = 'pending';
    } else if (pristine) {
      // FIXME: Once this form is correctly reset to a pristine state after a successful submit,
      //        re-enable this code.
      // submitState = 'complete';
    }

    languageOptions.unshift({ label: '--', value: '' });
    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form">
        <form id={id}>
          <FieldLabel text="Course" className="mt-4 mb-2 h2" />
          <Collapsible
            title={this.formatCourseTitle(title, courseStatuses)}
            key="Test Key"
            isOpen
          >
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={
                <FieldLabel
                  id="title.label"
                  text="Title"
                  required
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>Maximum 70 characters. Recommended 50 or fewer characters.</p>
                      <p>An effective course title:</p>
                      <ul>
                        <li>Clearly indicates the course subject matter.</li>
                        <li>Follows search engine optimization (SEO) guidelines.</li>
                        <li>Targets a global audience.</li>
                      </ul>
                      <p>
                        If the course is part of a sequence, include both sequence and course
                        information as “Sequence: Course”.
                      </p>
                      <p><b>Single course example:</b></p>
                      <p>English Grammar and Essay Writing</p>
                      <p><b>Sequential course examples:</b></p>
                      <ol>
                        <li>Statistics: Inference</li>
                        <li>Statistics: Probability</li>
                      </ol>
                    </div>
                  }
                />
              }
              required
              disabled={courseInReview}
            />
            <div>
              <FieldLabel id="number" text="Number" className="mb-2" />
              <div className="mb-3">{number}</div>
            </div>
            <Field
              name="short_description"
              component={RichEditor}
              label={
                <FieldLabel
                  id="sdesc.label"
                  text="Short description"
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>An effective short description:</p>
                      <ul>
                        <li>Contains 25–50 words.</li>
                        <li>Functions as a tagline.</li>
                        <li>Conveys compelling reasons to take the course.</li>
                        <li>Follows SEO guidelines.</li>
                        <li>Targets a global audience.</li>
                      </ul>
                      <p><b>Example:</b></p>
                      <p>
                        The first MOOC to teach positive psychology. Learn science-based
                        principles and practices for a happy, meaningful life.
                      </p>
                    </div>
                  }
                />
              }
              maxChars={500}
              id="sdesc"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="full_description"
              component={RichEditor}
              label={
                <FieldLabel
                  id="ldesc.label"
                  text="Long description"
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>An effective long description:</p>
                      <ul>
                        <li>Contains 150–300 words.</li>
                        <li>Is easy to skim.</li>
                        <li>Uses bullet points instead of dense text paragraphs.</li>
                        <li>Follows SEO guidelines.</li>
                        <li>Targets a global audience.</li>
                      </ul>
                      <p>
                        The first four lines are visible when the About page opens. Learners can
                        select “See More” to view the full description.
                      </p>
                      <p><b>Content-based example:</b></p>
                      <p>
                        Want to learn computer programming, but unsure where to begin? This is
                        the course for you! Scratch is the computer programming language that
                        makes it easy and fun to create interactive stories, games and animations
                        and share them online.
                      </p>
                      <p>
                        This course is an introduction to computer science using the programming
                        language Scratch, developed by MIT. Starting with the basics of using
                        Scratch, the course will stretch your mind and challenge you. You will
                        learn how to create amazing games, animated images and songs in just
                        minutes with a simple “drag and drop” interface.
                      </p>
                      <p>
                        No previous programming knowledge needed. Join us as you start your
                        computer science journey.
                      </p>
                      <p><b>Skills-based example:</b></p>
                      <p>
                        Taught by instructors with decades of experience on Wall Street, this
                        M&amp;A course will equip analysts and associates with the skills they need
                        to rise to employment in the M&amp;A field. Additionally, directors and
                        managers who have transitioned, or hope to transition, to M&amp;A from
                        other areas such as equities or fixed income can use this course to
                        eliminate skill gaps.
                      </p>
                    </div>
                  }
                />
              }
              maxChars={2500}
              id="ldesc"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="outcome"
              component={RichEditor}
              label={
                <FieldLabel
                  id="outcome.label"
                  text="What you will learn"
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>The skills and knowledge learners will acquire in this course.</p>
                      <p>Format each item as a bullet with four to ten words.</p>
                      <p><b>Example:</b></p>
                      <ul>
                        <li>Basic R Programming</li>
                        <li>An applied understanding of linear and logistic regression</li>
                        <li>Application of text analytics</li>
                        <li>Linear and integer optimization</li>
                      </ul>
                    </div>
                  }
                />
              }
              maxChars={2500}
              id="outcome"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={
                <FieldLabel
                  id="subject1.label"
                  text="Primary subject"
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>The subject of the course.</p>
                      <p>
                        You can select up to two subjects in addition to the primary subject.
                        Only the primary subject appears on the About page.
                      </p>
                    </div>
                  }
                />
              }
              options={subjectOptions}
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectSecondary"
              component={RenderSelectField}
              label={<FieldLabel text="Secondary subject" />}
              options={subjectOptions}
              disabled={courseInReview}
            />
            <Field
              name="subjectTertiary"
              component={RenderSelectField}
              label={<FieldLabel text="Tertiary subject" />}
              options={subjectOptions}
              disabled={courseInReview}
            />
            <Field
              name="imageSrc"
              component={ImageUpload}
              label={
                <FieldLabel
                  id="image.label"
                  text="Image"
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>
                        An eye-catching, colorful image that captures the essence of your course.
                      </p>
                      <ul>
                        <li>
                          <span>New course images must be 1134×675 pixels in size.</span>
                          <a
                            href="http://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/image_guidelines.html#course-image-size"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Learn more.
                          </a>
                        </li>
                        <li>Each course in a sequence must have a unique image.</li>
                        <li>The image cannot include text or headlines.</li>
                        <li>
                          You must have permission to use the image. Possible image sources
                          include Flickr creative commons, Stock Vault, Stock XCHNG, and iStock
                          Photo.
                        </li>
                      </ul>
                    </div>
                  }
                />
              }
              id="image"
              className="course-image"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="prerequisites_raw"
              component={RichEditor}
              label={
                <FieldLabel
                  id="prereq.label"
                  text="Prerequisites"
                  helpText={
                    <div>
                      <p>
                        Specific knowledge learners must have to be successful in the course.
                        If the course has no prerequisites, enter “None”.
                      </p>
                      <p><b>Examples:</b></p>
                      <ol>
                        <li>Secondary school (high school) algebra; basic mathematics concepts</li>
                        <li>Graduate-level understanding of Keynesian economics</li>
                        <li>Basic algebra</li>
                      </ol>
                    </div>
                  }
                />
              }
              maxChars={1000}
              id="prereq"
              disabled={courseInReview}
            />
            <Field
              name="level_type"
              component={RenderSelectField}
              label={
                <FieldLabel
                  id="level.label"
                  text="Course level"
                  requiredForSubmit
                  // TODO: these descriptions should come from the server -- levels are defined in
                  //       the database and are not suitable for hardcoding like this.
                  helpText={
                    <div>
                      <dl>
                        <dt>Introductory</dt>
                        <dd>
                          No prerequisites; a learner who has completed some or all secondary
                          school could complete the course.
                        </dd>
                        <dt>Intermediate</dt>
                        <dd>
                          Basic prerequisites; learners need to complete secondary school or some
                          university courses.
                        </dd>
                        <dt>Advanced</dt>
                        <dd>
                          Significant prerequisites; the course is geared to third or fourth year
                          university students or master’s degree students.
                        </dd>
                      </dl>
                    </div>
                  }
                />
              }
              options={levelTypeOptions}
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="learner_testimonials"
              component={RichEditor}
              label={
                <FieldLabel
                  id="testimonials.label"
                  text="Learner testimonials"
                  helpText={
                    <div>
                      <p>
                        A quote from a learner in the course, demonstrating the value of taking
                        the course.
                      </p>
                      <p>Should be no more than 25–50 words in length.</p>
                      <p><b>Example:</b></p>
                      <p>
                        “Brilliant course! It’s definitely the best introduction to electronics
                        in the world! Interesting material, clean explanations, well prepared
                        quizzes, challenging homework, and fun labs.” – Previous Student
                      </p>
                    </div>
                  }
                />
              }
              maxChars={500}
              id="learner-testimonials"
              disabled={courseInReview}
            />
            <Field
              name="faq"
              component={RichEditor}
              label={
                <FieldLabel
                  id="faq.label"
                  text="Frequently asked questions"
                  helpText={
                    <div>
                      <p>Any frequently asked questions and the answers to those questions.</p>
                    </div>
                  }
                />
              }
              maxChars={2500}
              id="faq"
              disabled={courseInReview}
            />
            <Field
              name="additional_information"
              component={RichEditor}
              label={
                <FieldLabel
                  id="additional-info.label"
                  text="Additional information"
                  helpText={
                    <div>
                      <p>Any additional information to be provided to learners.</p>
                    </div>
                  }
                />
              }
              maxChars={2500}
              id="additional-information"
              disabled={courseInReview}
            />
            <Field
              name="syllabus_raw"
              component={RichEditor}
              label={
                <FieldLabel
                  id="syllabus.label"
                  text="Syllabus"
                  helpText={
                    <div>
                      <p>
                        A review of content covered in your course, organized by week or module.
                      </p>
                      <p>Focus on topics and content.</p>
                      <p>
                        Do not include detailed information about course logistics, such as
                        grading, communication policies, and reading lists.
                      </p>
                      <p>Format items as either paragraphs or a bulleted list.</p>
                      <p><b>Example:</b></p>
                      <ul>
                        <li>
                          <p>Week 1: From Calculator to Computer</p>
                          <p>
                            Introduction to basic programming concepts, such as values and
                            expressions, as well as making decisions when implementing algorithms
                            and developing programs.
                          </p>
                        </li>
                        <li>
                          <p>Week 2: State Transformation</p>
                          <p>
                            Introduction to state transformation, including representation of data
                            and programs as well as conditional repetition.
                          </p>
                        </li>
                      </ul>
                    </div>
                  }
                />
              }
              maxChars={500}
              id="syllabus"
              disabled={courseInReview}
            />
            <Field
              name="videoSrc"
              component={RenderInputTextField}
              type="url"
              label={
                <FieldLabel
                  id="video.label"
                  text="About video link"
                  helpText={
                    <div>
                      <p>
                        The About video should excite and entice potential students to take your
                        course. Think of it as a movie trailer or TV show promotion. The video
                        should be compelling, and exhibit the instructor’s personality.
                      </p>
                      <p>
                        The ideal length is 30–90 seconds (learners typically watch an average
                        of 30 seconds).
                      </p>
                      <p>
                        The About video should be produced and edited, using elements such as
                        graphics and stock footage.
                      </p>
                      <p>The About video should answer these key questions.</p>
                      <ul>
                        <li>Why should a learner register?</li>
                        <li>What topics and concepts are covered?</li>
                        <li>Who is teaching the course?</li>
                        <li>What institution is delivering the course?</li>
                      </ul>
                      <p>Naming specifications:</p>
                      <ul>
                        <li>Name: InstitutionX_CourseNumber_About.mp4</li>
                        <li>
                          {/* spans avoid a jsx-to-string bug that would skip the text */}
                          <span>Post to:</span>
                          <a
                            href="http://veda.edx.org/upload"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            http://veda.edx.org/upload
                          </a>
                        </li>
                      </ul>
                      <p>Technical specifications:</p>
                      <ul>
                        <li>Codec: H.264</li>
                        <li>Container: .mp4</li>
                        <li>Resolution: 1920×1080</li>
                        <li>Frame rate: 29.97 fps</li>
                        <li>Aspect: 1.0</li>
                        <li>Bitrate: 5Mbps VBR</li>
                        <li>Audio codec: AAC 44.1KHz/192 Kbps</li>
                      </ul>
                      <p>
                        <span>Visit</span>
                        <a
                          href="www.youtube.com/user/EdXOnline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          edX’s YouTube channel
                        </a>
                        <span>for examples of other About videos.</span>
                      </p>
                    </div>
                  }
                />
              }
              disabled={courseInReview}
            />
            {entitlement && (
              <React.Fragment>
                <Field
                  name="mode"
                  component={RenderSelectField}
                  label={
                    <FieldLabel
                      id="mode.label"
                      text="Enrollment track"
                      helpText={
                        <div>
                          <p>
                            If the course offers a verified or professional education certificate,
                            select the certificate type and enter the price for the certificate.
                          </p>
                        </div>
                      }
                    />
                  }
                  options={this.getEnrollmentTrackOptions()}
                  disabled={courseInReview}
                />
                <Field
                  name="price"
                  component={RenderInputTextField}
                  input={{
                    min: 0.01,
                    step: 0.01,
                  }}
                  type="number"
                  label={<FieldLabel text="Price" required requiredForSubmit />}
                  disabled={courseInReview}
                  required={isSubmittingForReview}
                />
              </React.Fragment>
            )}
          </Collapsible>
          <FieldLabel text="Course runs" className="mt-4 mb-2 h2" />
          <FieldArray
            name="course_runs"
            component={CollapsibleCourseRunFields}
            languageOptions={languageOptions}
            pacingTypeOptions={pacingTypeOptions}
            formId={id}
            courseUuid={uuid}
            courseSubmitting={submitting}
            {...this.props}
          />
          <ButtonToolbar className="mt-3">
            <Link to={`/courses/${uuid}/course_runs/new`}>
              <button
                className="btn btn-outline-primary"
                disabled={!pristine || courseInReview}
              >
                Re-run Course
              </button>
            </Link>
            <ActionButton
              disabled={courseInReview || submitting}
              labels={{
                default: 'Save Course',
                pending: 'Saving Course',
                complete: 'Course Saved',
              }}
              state={submitState}
              onClick={(event) => {
                /*
                *  Prevent default submission and pass the targeted course run up through the
                *  handler to manually validate fields based off the run status.
                */
                event.preventDefault();
                handleSubmit();
              }}
            />
          </ButtonToolbar>
        </form>
      </div>
    );
  }
}

BaseEditCourseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  entitlement: PropTypes.bool,
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
  courseStatuses: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  isSubmittingForReview: PropTypes.bool,
};

BaseEditCourseForm.defaultProps = {
  submitting: false,
  pristine: true,
  courseInReview: false,
  courseStatuses: [],
  isSubmittingForReview: false,
  entitlement: false,
};

const EditCourseForm = compose(
  connect((state, props) => ({
    // Give form a unique id so that values from one course form don't overwrite others
    form: props.id,
  })),
  reduxForm({
    enableReinitialize: true, // Reload staff changes when returning from editing /creating staffers
    keepDirtyOnReinitialize: true, // Don't wipe out changes on reinitialization
    destroyOnUnmount: false, // Keep the form state in redux when editing / creating staffers
  }),
)(BaseEditCourseForm);

export default EditCourseForm;
